const crypto = require('crypto');
const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} = require('@simplewebauthn/server');

const Passkey = require('../models/passkey');
const User = require('../models/user');
const redisClient = require('../services/redisService');
const { generateToken } = require('../services/jwtService');
const { resolveRp } = require('../config/webauthn');
const { defaultPasskeyName } = require('../services/passkeyMetadata');

/**
 * @swagger
 * tags:
 *   name: Passkeys
 *   description: WebAuthn passkey registration, authentication and management
 */

const CHALLENGE_TTL_SECONDS = 300; // 5 minutes — generous for the OS prompt.
const MAX_NAME_LENGTH = 60;

const regChallengeKey = userId => `webauthn:reg:${userId}`;
const authChallengeKey = flowId => `webauthn:auth:${flowId}`;

const sanitizeName = value => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_NAME_LENGTH);
};

// Reject browser requests whose Origin is not on the configured allowlist.
const ensureAllowedOrigin = (rp, res) => {
  if (!rp.allowed) {
    res.status(403).json({ error: 'Origin not allowed for passkey operations' });
    return false;
  }
  return true;
};

/**
 * @swagger
 * /api/passkeys/register/options:
 *   post:
 *     summary: Begin passkey registration for the authenticated user
 *     tags: [Passkeys]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PublicKeyCredentialCreationOptions to pass to the browser.
 *       401:
 *         description: Authentication required.
 */
exports.getRegistrationOptions = async (req, res, next) => {
  try {
    const rp = resolveRp(req);
    if (!ensureAllowedOrigin(rp, res)) return;

    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existing = await Passkey.find({ user: userId });

    const options = await generateRegistrationOptions({
      rpName: rp.rpName,
      rpID: rp.rpID,
      userName: user.email,
      userID: new TextEncoder().encode(user._id.toString()),
      userDisplayName: user.username || user.email,
      attestationType: 'none',
      excludeCredentials: existing.map(cred => ({
        id: cred.credentialID,
        transports: cred.transports,
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
    });

    await redisClient.set(regChallengeKey(userId), options.challenge, { EX: CHALLENGE_TTL_SECONDS });

    res.status(200).json(options);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/passkeys/register/verify:
 *   post:
 *     summary: Complete passkey registration and store the credential
 *     tags: [Passkeys]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [response]
 *             properties:
 *               response:
 *                 type: object
 *                 description: The RegistrationResponseJSON produced by the browser.
 *               name:
 *                 type: string
 *                 description: Optional friendly name for the passkey.
 *     responses:
 *       201:
 *         description: Passkey registered successfully.
 *       400:
 *         description: Verification failed or challenge expired.
 */
exports.verifyRegistration = async (req, res, next) => {
  try {
    const rp = resolveRp(req);
    if (!ensureAllowedOrigin(rp, res)) return;

    const userId = req.user.userId;
    const { response, name } = req.body;
    if (!response) {
      return res.status(400).json({ error: 'Missing registration response' });
    }

    const challengeKey = regChallengeKey(userId);
    const expectedChallenge = await redisClient.get(challengeKey);
    if (!expectedChallenge) {
      return res.status(400).json({ error: 'Registration challenge expired. Please try again.' });
    }

    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response,
        expectedChallenge,
        expectedOrigin: rp.origin,
        expectedRPID: rp.rpID,
        requireUserVerification: false,
      });
    } catch (err) {
      await redisClient.del(challengeKey);
      return res.status(400).json({ error: 'Passkey verification failed', details: err.message });
    }

    await redisClient.del(challengeKey);

    if (!verification.verified || !verification.registrationInfo) {
      return res.status(400).json({ error: 'Passkey verification failed' });
    }

    const { credential, credentialDeviceType, credentialBackedUp, aaguid } = verification.registrationInfo;

    const existing = await Passkey.findOne({ credentialID: credential.id });
    if (existing) {
      return res.status(409).json({ error: 'This passkey is already registered' });
    }

    const transports = credential.transports || [];
    const finalName = sanitizeName(name) || defaultPasskeyName({ aaguid, transports, deviceType: credentialDeviceType });

    let passkey;
    try {
      passkey = await Passkey.create({
        user: userId,
        credentialID: credential.id,
        publicKey: Buffer.from(credential.publicKey),
        counter: credential.counter || 0,
        transports,
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp,
        aaguid: aaguid || '',
        name: finalName,
        lastUsedAt: new Date(),
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ error: 'This passkey is already registered' });
      }
      throw err;
    }

    res.status(201).json({ message: 'Passkey registered successfully', passkey: passkey.toClientJSON() });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/passkeys/login/options:
 *   post:
 *     summary: Begin passwordless passkey authentication
 *     tags: [Passkeys]
 *     responses:
 *       200:
 *         description: Authentication options and a one-time flow identifier.
 */
exports.getLoginOptions = async (req, res, next) => {
  try {
    const rp = resolveRp(req);
    if (!ensureAllowedOrigin(rp, res)) return;

    // Usernameless / discoverable-credential flow: no allowCredentials so the
    // browser offers any passkey registered for this RP.
    const options = await generateAuthenticationOptions({
      rpID: rp.rpID,
      userVerification: 'preferred',
    });

    const flowId = crypto.randomUUID();
    await redisClient.set(authChallengeKey(flowId), options.challenge, { EX: CHALLENGE_TTL_SECONDS });

    res.status(200).json({ flowId, options });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/passkeys/login/verify:
 *   post:
 *     summary: Complete passkey authentication and issue a JWT
 *     tags: [Passkeys]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [flowId, response]
 *             properties:
 *               flowId:
 *                 type: string
 *               response:
 *                 type: object
 *                 description: The AuthenticationResponseJSON produced by the browser.
 *     responses:
 *       200:
 *         description: Login successful, returns a JWT.
 *       401:
 *         description: Passkey not recognized or verification failed.
 */
exports.verifyLogin = async (req, res, next) => {
  try {
    const rp = resolveRp(req);
    if (!ensureAllowedOrigin(rp, res)) return;

    const { flowId, response } = req.body;
    if (!flowId || !response) {
      return res.status(400).json({ error: 'Missing flowId or response' });
    }

    const challengeKey = authChallengeKey(flowId);
    const expectedChallenge = await redisClient.get(challengeKey);
    if (!expectedChallenge) {
      return res.status(400).json({ error: 'Authentication challenge expired. Please try again.' });
    }

    const passkey = await Passkey.findOne({ credentialID: response.id });
    if (!passkey) {
      await redisClient.del(challengeKey);
      return res.status(401).json({ error: 'Passkey not recognized' });
    }

    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response,
        expectedChallenge,
        expectedOrigin: rp.origin,
        expectedRPID: rp.rpID,
        credential: {
          id: passkey.credentialID,
          publicKey: new Uint8Array(passkey.publicKey),
          counter: passkey.counter,
          transports: passkey.transports,
        },
        requireUserVerification: false,
      });
    } catch (err) {
      await redisClient.del(challengeKey);
      return res.status(401).json({ error: 'Passkey verification failed', details: err.message });
    }

    await redisClient.del(challengeKey);

    if (!verification.verified) {
      return res.status(401).json({ error: 'Passkey verification failed' });
    }

    // Persist the rolling signature counter and last-used timestamp.
    passkey.counter = verification.authenticationInfo.newCounter;
    passkey.lastUsedAt = new Date();
    await passkey.save();

    const user = await User.findById(passkey.user);
    if (!user) {
      return res.status(401).json({ error: 'Account no longer exists' });
    }

    const token = generateToken(user._id);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/passkeys:
 *   get:
 *     summary: List the authenticated user's passkeys
 *     tags: [Passkeys]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: An array of the user's passkeys (without credential material).
 */
exports.listPasskeys = async (req, res, next) => {
  try {
    const passkeys = await Passkey.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(passkeys.map(p => p.toClientJSON()));
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/passkeys/{id}:
 *   patch:
 *     summary: Rename one of the authenticated user's passkeys
 *     tags: [Passkeys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated passkey.
 *       404:
 *         description: Passkey not found.
 */
exports.renamePasskey = async (req, res, next) => {
  try {
    const name = sanitizeName(req.body.name);
    if (!name) {
      return res.status(400).json({ error: 'A non-empty name is required' });
    }

    const passkey = await Passkey.findOneAndUpdate({ _id: req.params.id, user: req.user.userId }, { name }, { new: true, runValidators: true });

    if (!passkey) {
      return res.status(404).json({ error: 'Passkey not found' });
    }

    res.status(200).json(passkey.toClientJSON());
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid passkey ID' });
    }
    next(error);
  }
};

/**
 * @swagger
 * /api/passkeys/{id}:
 *   delete:
 *     summary: Delete one of the authenticated user's passkeys
 *     tags: [Passkeys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Passkey deleted.
 *       404:
 *         description: Passkey not found.
 */
exports.deletePasskey = async (req, res, next) => {
  try {
    const passkey = await Passkey.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!passkey) {
      return res.status(404).json({ error: 'Passkey not found' });
    }
    res.status(200).json({ message: 'Passkey deleted' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid passkey ID' });
    }
    next(error);
  }
};
