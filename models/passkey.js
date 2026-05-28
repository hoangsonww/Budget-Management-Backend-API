const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Passkey:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the passkey record.
 *           example: "64c9f8f2a73c2f001b3c68f4"
 *         name:
 *           type: string
 *           description: A user-friendly label for the passkey.
 *           example: "MacBook Touch ID"
 *         deviceType:
 *           type: string
 *           description: Whether the credential lives on a single device or is synced.
 *           enum: [singleDevice, multiDevice]
 *           example: "multiDevice"
 *         backedUp:
 *           type: boolean
 *           description: Whether the credential is backed up / synced (e.g. via iCloud Keychain).
 *           example: true
 *         transports:
 *           type: array
 *           items:
 *             type: string
 *           description: The transports the authenticator advertised.
 *           example: ["internal", "hybrid"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-10-01T12:34:56.789Z"
 *         lastUsedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2024-10-05T08:11:02.000Z"
 */

/**
 * A single WebAuthn credential (passkey) belonging to a user. A user may own
 * many passkeys. The public key, signature counter and credential id are the
 * security-critical fields; everything else is metadata for the management UI.
 */
const passkeySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Base64URL-encoded credential ID. Unique across all users.
    credentialID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // COSE public key bytes returned by the authenticator.
    publicKey: {
      type: Buffer,
      required: true,
    },
    // Signature counter used to detect cloned authenticators.
    counter: {
      type: Number,
      required: true,
      default: 0,
    },
    transports: {
      type: [String],
      default: [],
    },
    // 'singleDevice' | 'multiDevice' (synced passkey).
    deviceType: {
      type: String,
      enum: ['singleDevice', 'multiDevice'],
      default: 'singleDevice',
    },
    backedUp: {
      type: Boolean,
      default: false,
    },
    // Authenticator model identifier; used to suggest a friendly name.
    aaguid: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

// Expose a lean, credential-free view for API responses. The public key,
// counter and raw credential id never need to leave the server.
passkeySchema.methods.toClientJSON = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    deviceType: this.deviceType,
    backedUp: this.backedUp,
    transports: this.transports,
    aaguid: this.aaguid,
    createdAt: this.createdAt,
    lastUsedAt: this.lastUsedAt,
  };
};

module.exports = mongoose.model('Passkey', passkeySchema);
