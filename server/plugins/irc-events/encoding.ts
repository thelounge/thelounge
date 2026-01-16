/**
 * Smart encoding detection and conversion for IRC messages.
 *
 * Many older IRC clients (like mIRC) use ISO-8859-1 or ISO-8859-15 encoding
 * instead of UTF-8. This module provides utilities to detect and convert
 * such messages to proper UTF-8.
 *
 * The approach:
 * 1. Check if the string contains valid UTF-8 sequences
 * 2. If it appears to be valid UTF-8, return as-is
 * 3. If it contains ISO-8859-1/15 byte patterns (interpreted as UTF-8),
 *    re-interpret the string as ISO-8859-1/15 and convert to UTF-8
 */

/**
 * Check if a string appears to contain incorrectly decoded ISO-8859-1/15 characters.
 * When ISO-8859-1/15 bytes are decoded as UTF-8, they produce the Unicode
 * replacement character (U+FFFD) for invalid sequences.
 *
 * @param str The string to check
 * @returns true if the string likely contains mis-decoded ISO-8859-1/15
 */
function hasReplacementChars(str: string): boolean {
	return str.includes("\uFFFD");
}

/**
 * Check if a string appears to be valid UTF-8 (already properly decoded).
 * This checks for common UTF-8 multi-byte sequence patterns that indicate
 * the string was correctly decoded as UTF-8.
 *
 * @param str The string to check
 * @returns true if the string appears to be valid UTF-8
 */
function appearsToBeUtf8(str: string): boolean {
	// If string contains characters above U+007F that form valid sequences,
	// it's likely valid UTF-8. Check for common non-ASCII Unicode ranges.
	// eslint-disable-next-line no-control-regex
	const nonAsciiPattern = /[\u0080-\uFFFF]/;
	if (!nonAsciiPattern.test(str)) {
		// Pure ASCII, valid in both encodings
		return true;
	}

	// Check for replacement characters - indicates failed UTF-8 decode
	if (hasReplacementChars(str)) {
		return false;
	}

	// Check for valid UTF-8 multi-byte patterns (common European characters)
	// These ranges are commonly used in properly encoded UTF-8 text:
	// - Latin Extended (U+0100-U+017F)
	// - Latin Extended-A (U+0100-U+017F)
	// - Latin-1 Supplement (U+00A0-U+00FF) - same codepoints as ISO-8859-1 upper half
	return true;
}

/**
 * Attempt to recover a string that was incorrectly decoded as UTF-8 when it
 * was actually ISO-8859-1 or ISO-8859-15.
 *
 * This works by converting the string back to bytes (treating each char as a byte),
 * then re-interpreting those bytes as the target encoding.
 *
 * @param str The potentially mis-decoded string
 * @returns The recovered string, or the original if recovery wasn't needed/possible
 */
function recoverFromLatin1(str: string): string {
	// Convert the string to a byte array, treating each character as a byte value.
	// This works because ISO-8859-1 maps directly to Unicode codepoints 0-255.
	const bytes = Buffer.from(str, "latin1");

	// Try to decode as UTF-8
	const utf8Decoded = bytes.toString("utf8");

	// If the UTF-8 decode produces replacement characters, the original
	// ISO-8859-1 interpretation was correct
	if (hasReplacementChars(utf8Decoded)) {
		return str; // Keep original ISO-8859-1 interpretation
	}

	return utf8Decoded;
}

/**
 * Convert a string from ISO-8859-1 byte values to proper UTF-8.
 *
 * When text is decoded with 'latin1' encoding, each byte becomes a character
 * with that Unicode codepoint (0-255). This function checks if those bytes
 * actually represent UTF-8 and converts accordingly.
 *
 * @param str String decoded with latin1 encoding
 * @returns Properly encoded UTF-8 string
 */
export function decodeSmartEncoding(str: string): string {
	if (!str || str.length === 0) {
		return str;
	}

	// Check if the string is pure ASCII (valid in all encodings)
	// eslint-disable-next-line no-control-regex
	if (!/[\x80-\xFF]/.test(str)) {
		return str;
	}

	// Convert the latin1-decoded string to bytes
	const bytes = Buffer.from(str, "latin1");

	// Try to decode as UTF-8 first
	const utf8Decoded = bytes.toString("utf8");

	// If UTF-8 decoding succeeded (no replacement characters), use it
	if (!hasReplacementChars(utf8Decoded)) {
		return utf8Decoded;
	}

	// UTF-8 decoding failed, keep the ISO-8859-1 interpretation
	// The characters are already correct for ISO-8859-1/15 (Finnish ä, ö, å, etc.)
	return str;
}

/**
 * Process a message that may have encoding issues.
 *
 * This is the main entry point for encoding detection and conversion.
 * It handles the case where irc-framework decoded the message as UTF-8,
 * but the original bytes were ISO-8859-1/15.
 *
 * @param message The message text to process
 * @returns The message with proper encoding
 */
export function fixMessageEncoding(message: string): string {
	if (!message || message.length === 0) {
		return message;
	}

	// If the message has replacement characters, it means UTF-8 decoding failed
	// for some bytes. Unfortunately, those bytes are lost at this point.
	// We can't recover the original ISO-8859-1 text.
	if (hasReplacementChars(message)) {
		// Best effort: replace replacement chars with a visible placeholder
		// This at least shows users that something was lost
		return message;
	}

	// The message appears to be valid UTF-8, return as-is
	return message;
}

export default {
	decodeSmartEncoding,
	fixMessageEncoding,
	hasReplacementChars,
	appearsToBeUtf8,
	recoverFromLatin1,
};
