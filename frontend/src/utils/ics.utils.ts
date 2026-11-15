// eslint-disable-next-line no-control-regex
const ICS_CONTROL_CHARS_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/**
 * Escapes text for RFC 5545 iCalendar (ICS) property values and strips control characters.
 */
export function sanitizeIcsText(input: string): string {
  return input
    .replace(ICS_CONTROL_CHARS_REGEX, "")
    .replaceAll("\\", "\\\\")
    .replaceAll("\r\n", "\\n")
    .replaceAll("\n", "\\n")
    .replaceAll("\r", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
}

/**
 * Pads a non-negative integer to at least 2 digits with a leading zero.
 */
export function pad2(value: number): string {
  return String(value).padStart(2, "0");
}
