import { useEffect } from "react";
import { Font } from "@react-pdf/renderer";
import { getAllFontFamiliesToRegister } from "components/fonts/lib";

const disableReactPDFHyphenation = (word: string) => [word];

/**
 * Register all fonts to React PDF so it can render fonts correctly in PDF
 */
export const useRegisterReactPDFFont = () => {
  useEffect(() => {
    const allFontFamilies = getAllFontFamiliesToRegister();
    allFontFamilies.forEach((fontFamily) => {
      Font.register({
        family: fontFamily,
        fonts: [
          {
            src: `fonts/${fontFamily}-Regular.ttf`,
          },
          {
            src: `fonts/${fontFamily}-Bold.ttf`,
            fontWeight: "bold",
          },
        ],
      });
    });
  }, []);
};

export const useRegisterReactPDFHyphenationCallback = (fontFamily: string) => {
  useEffect(() => {
    // React PDF inserts a visible "-" at callback split points, so keep the
    // global callback disabled. CJK wrapping is handled with zero-width spaces
    // in ResumePDFText instead.
    Font.registerHyphenationCallback(disableReactPDFHyphenation);
  }, [fontFamily]);
};
