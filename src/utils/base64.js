const bytesToBase64 = (stringData) => {
  try {
    const binString = String.fromCharCode(...new Uint8Array(stringData));
    return btoa(binString);
  } catch (err) {
    console.error("Caught error when handling byteToBase64(stringData): ", err);
  }
};

const base64ToBytes = (base64) => {
  try {
    const binString = atob(base64);
    return Uint8Array.from(binString, (m) => m.codePointAt(0));
  } catch (err) {
    console.error("Caught error when handling base64ToBytes(base64): ", err);
  }
};

export const base64Utils = {
  base64ToBytes,
  bytesToBase64,
};
