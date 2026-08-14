const NORMALIZED_LINE_BREAK = "\n";

/**
 * Normalize line breaks to be \n since different OS uses different line break
 *    Windows -> \r\n (CRLF)
 *    Unix    -> \n (LF)
 *    Mac     -> \n (LF), or \r (CR) for earlier versions
 */
const normalizeLineBreak = (str: string) =>
  str.replace(/\r?\n/g, NORMALIZED_LINE_BREAK);

const getStringsByLineBreak = (str: string) => str.split(NORMALIZED_LINE_BREAK);

export const getTextareaValueFromBulletListStrings = (
  bulletListStrings: string[]
) => {
  return bulletListStrings.join(NORMALIZED_LINE_BREAK);
};

export const getBulletListStringsFromTextareaValue = (
  textareaValue: string
) => {
  const textareaValueWithNormalizedLineBreak =
    normalizeLineBreak(textareaValue);

  const strings = getStringsByLineBreak(textareaValueWithNormalizedLineBreak);
  return strings.length === 1 && strings[0] === "" ? [] : strings;
};
