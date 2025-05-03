function time(timeOffset: number = 0): number {
  return Math.floor(Date.now() / 1000) + timeOffset;
}

async function generateHmac(
  secret: ArrayBuffer,
  buffer: ArrayBuffer
): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey(
    "raw",
    secret,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  return await crypto.subtle.sign("HMAC", key, buffer);
}

function arrayBufferToBase64(buffer: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < buffer.byteLength; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary);
}

function hexToArrayBuffer(hex: string): ArrayBuffer {
  const typedArray = new Uint8Array(hex.length / 2);
  for (let i = 0; i < typedArray.length; i++) {
    typedArray[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return typedArray.buffer;
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryStr = atob(base64);
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes.buffer;
}

function base32ToArrayBuffer(base32: string): ArrayBuffer {
  const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  let result = "";

  for (let i = 0; i < base32.length; i++) {
    const val = base32chars.indexOf(base32.charAt(i).toUpperCase());
    bits += val.toString(2).padStart(5, "0");
  }

  for (let i = 0; i + 8 <= bits.length; i += 8) {
    result += String.fromCharCode(parseInt(bits.substring(i, i + 8), 2));
  }

  const bytes = new Uint8Array(result.length);
  for (let i = 0; i < result.length; i++) {
    bytes[i] = result.charCodeAt(i);
  }

  return bytes.buffer;
}

function bufferizeSecret(secret: ArrayBuffer | string): ArrayBuffer {
  if (typeof secret === "string") {
    // Check if it's a hex string (40 hex characters)
    if (/^[0-9a-f]{40}$/i.test(secret)) {
      return hexToArrayBuffer(secret);
    } else {
      // Assume it's base64
      return base64ToArrayBuffer(secret);
    }
  }
  if (secret instanceof ArrayBuffer) return secret;
  if (ArrayBuffer.isView(secret)) {
    const s = secret as ArrayBufferView;
    return s.buffer;
  }
  throw new Error("Invalid secret type");
}

/**
 * Generate a Steam-style TOTP authentication code.
 * @param {string} setupCode - Your TOTP shared secret in base32.
 * @param {number} [timeOffset=0] - Seconds to offset the current time.
 * @returns {Promise<string>}
 */
export async function generateAuthCode(
  setupCode: string,
  timeOffset: number = 0
): Promise<string> {
  const secret = bufferizeSecret(base32ToArrayBuffer(setupCode));

  const t = time(timeOffset);

  // Create an 8‑byte buffer and write:
  //   - 0 as the first 4 bytes,
  //   - floor(t/30) as the last 4 bytes.
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setUint32(0, 0);
  view.setUint32(4, Math.floor(t / 30));

  // Compute HMAC‑SHA1 of the buffer.
  const hmacBuffer = await generateHmac(secret, buffer);
  const hmac = new Uint8Array(hmacBuffer);

  // Use dynamic truncation as in TOTP.
  const start = hmac[19] & 0x0f;
  const codeSlice = hmac.slice(start, start + 4);
  const view2 = new DataView(codeSlice.buffer);
  let fullcode = view2.getUint32(0) & 0x7fffffff;

  const chars = "23456789BCDFGHJKMNPQRTVWXY";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(fullcode % chars.length);
    fullcode = Math.floor(fullcode / chars.length);
  }
  return code;
}
// Alias for generateAuthCode
export const getAuthCode = generateAuthCode;
