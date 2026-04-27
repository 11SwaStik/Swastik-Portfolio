// Splits text into user-perceived characters (grapheme clusters), so that
// Devanagari conjuncts like स्व stay intact instead of breaking into base
// consonant + virama + consonant. Falls back to code-point split on engines
// without Intl.Segmenter (very old browsers, ancient Node).
export function splitGraphemes(text: string, locale = "und"): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const seg = new Intl.Segmenter(locale, { granularity: "grapheme" });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}
