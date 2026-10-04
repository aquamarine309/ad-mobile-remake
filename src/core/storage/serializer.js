import * as pako from "pako";

const STARTING_STRING = "AntimatterDimensionsVue3SavefileFormat";
const ENDING_STRING = "EndOfSavefile";
const VERSION = "AAA";

function bytesToBinary(bytes) {
  // Avoid String.fromCharCode.apply which hits the argument limit on large saves
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return binary;
}

function binaryToBytes(binary) {
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function encodeBody(jsonText) {
  const bytes = pako.deflate(jsonText, { gzip: true });
  const base64 = btoa(bytesToBinary(bytes));
  return base64
    .replace(/0/gu, "0a")
    .replace(/\+/gu, "0b")
    .replace(/\//gu, "0c");
}

function decodeBody(body) {
  const base64 = body
    .replace(/0c/gu, "/")
    .replace(/0b/gu, "+")
    .replace(/0a/gu, "0");
  const binary = atob(base64);
  const bytes = binaryToBytes(binary);
  const inflated = pako.inflate(bytes);
  return new TextDecoder().decode(inflated);
}

/**
 * Encode a JSON string into a portable save string.
 */
export function encodeSave(jsonText) {
  return `${STARTING_STRING}${VERSION}${encodeBody(jsonText)}${ENDING_STRING}`;
}

/**
 * Decode a portable save string into the original JSON string.
 * Throws if the format is invalid.
 */
export function decodeSave(text) {
  if (typeof text !== "string") {
    throw new Error("Save is not a string");
  }
  if (!text.startsWith(STARTING_STRING)) {
    throw new Error("Unrecognized save format (missing header)");
  }
  const versionStart = STARTING_STRING.length;
  const version = text.slice(versionStart, versionStart + 3);
  if (version !== VERSION) {
    throw new Error(`Unsupported save version: ${version}`);
  }
  if (!text.endsWith(ENDING_STRING)) {
    throw new Error("Save is truncated (missing footer)");
  }
  const body = text.slice(versionStart + 3, -ENDING_STRING.length);
  return decodeBody(body);
}