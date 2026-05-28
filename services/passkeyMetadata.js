/**
 * Maps well-known authenticator AAGUIDs to human-friendly names and derives a
 * sensible default label for a freshly registered passkey. The list mirrors the
 * community-maintained passkey provider AAGUID dataset; unknown authenticators
 * fall back to a transport/device-type heuristic.
 */

const AAGUID_NAMES = {
  'ea9b8d66-4d01-1d21-3ce4-b6b48cb575d4': 'Google Password Manager',
  'adce0002-35bc-c60a-648b-0b25f1f05503': 'Chrome on Mac',
  '08987058-cadc-4b81-b6e1-30de50dcbe96': 'Windows Hello',
  '9ddd1817-af5a-4672-a2b9-3e3dd95000a9': 'Windows Hello',
  '6028b017-b1d4-4c02-b4b3-afcdafc96bb2': 'Windows Hello',
  'fbfc3007-154e-4ecc-8c0b-6e020557d7bd': 'iCloud Keychain',
  'dd4ec289-e01d-41c9-bb89-70fa845d4bf2': 'iCloud Keychain (Managed)',
  'bada5566-a7aa-401f-bd96-45619a55120d': '1Password',
  'b84e4048-15dc-4dd0-8640-f4f60813c8af': 'NordPass',
  '0ea242b4-43c4-4a1b-8b17-dd6d0b6baec6': 'Keeper',
  'f3809540-7f14-49c1-a8b3-8f813b225541': 'Enpass',
  '891494da-2c90-4d31-a9d4-4eb0676a53ec': 'Proton Pass',
  '531126d6-e717-415c-9320-3d9aa6981239': 'Dashlane',
  'fdb141b2-5d84-443e-8a35-4698c205a502': 'KeePassXC',
  'd548826e-79b4-db40-a3d8-11116f7e8349': 'Bitwarden',
  'cc45f64e-52a2-451b-831a-4edd8022a202': 'ToothPic Passkey Provider',
  '2fc0579f-8113-47ea-b116-bb5a8db9202a': 'YubiKey 5 Series',
  'cb69481e-8ff7-4039-93ec-0a2729a154a8': 'YubiKey 5 Series',
  'ee882879-721c-4913-9775-3dfcce97072a': 'YubiKey 5 Series',
  'fa2b99dc-9e39-4257-8f92-4a30d23c4118': 'YubiKey 5 Series (NFC)',
};

const ZERO_AAGUID = '00000000-0000-0000-0000-000000000000';

/**
 * Derive a friendly default name for a newly registered passkey.
 * @param {{ aaguid?: string, transports?: string[], deviceType?: string }} info
 * @returns {string}
 */
const defaultPasskeyName = ({ aaguid, transports = [], deviceType } = {}) => {
  if (aaguid && aaguid !== ZERO_AAGUID && AAGUID_NAMES[aaguid]) {
    return AAGUID_NAMES[aaguid];
  }

  const t = new Set(transports);
  if (t.has('internal')) return 'This device';
  if (t.has('hybrid')) return 'Phone or tablet';
  if (t.has('usb') || t.has('nfc') || t.has('ble')) return 'Security key';
  if (deviceType === 'multiDevice') return 'Synced passkey';

  return 'Passkey';
};

module.exports = { AAGUID_NAMES, defaultPasskeyName };
