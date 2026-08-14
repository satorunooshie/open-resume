import { useEffect, useState, type RefObject } from "react";
import {
  A4_HEIGHT_PX,
  A4_WIDTH_PX,
  LETTER_HEIGHT_PX,
  LETTER_WIDTH_PX,
} from "lib/constants";
import { getPxPerRem } from "lib/get-px-per-rem";
import { CSS_VARIABLES } from "globals-css";

/**
 * useSetDefaultScale sets the default scale of the resume on load.
 *
 * It computes the scale based on current screen height and derives the default
 * resume height by subtracting the screen height from the total heights of top
 * nav bar, resume control bar, and resume top & bottom padding.
 */
export const useSetDefaultScale = ({
  setScale,
  documentSize,
  previewContainerRef,
}: {
  setScale: (scale: number) => void;
  documentSize: string;
  previewContainerRef?: RefObject<HTMLElement>;
}) => {
  const [scaleOnResize, setScaleOnResize] = useState(true);

  useEffect(() => {
    const getPreviewContentWidthPx = () => {
      const container = previewContainerRef?.current;
      if (!container) return undefined;

      const containerStyle = window.getComputedStyle(container);
      const paddingLeft = parseFloat(containerStyle.paddingLeft) || 0;
      const paddingRight = parseFloat(containerStyle.paddingRight) || 0;
      return Math.max(0, container.clientWidth - paddingLeft - paddingRight);
    };

    const getPreviewContentHeightPx = () => {
      const container = previewContainerRef?.current;
      if (!container) return undefined;

      const containerStyle = window.getComputedStyle(container);
      const paddingTop = parseFloat(containerStyle.paddingTop) || 0;
      const paddingBottom = parseFloat(containerStyle.paddingBottom) || 0;
      return Math.max(0, container.clientHeight - paddingTop - paddingBottom);
    };

    const getDefaultScale = () => {
      const screenHeightPx = window.innerHeight;
      const PX_PER_REM = getPxPerRem();
      const screenHeightRem = screenHeightPx / PX_PER_REM;
      const topNavBarHeightRem = parseFloat(
        CSS_VARIABLES["--top-nav-bar-height"]
      );
      const resumeControlBarHeight = parseFloat(
        CSS_VARIABLES["--resume-control-bar-height"]
      );
      const resumePadding = parseFloat(CSS_VARIABLES["--resume-padding"]);
      const topAndBottomResumePadding = resumePadding * 2;
      const fallbackResumeHeightRem =
        screenHeightRem -
        topNavBarHeightRem -
        resumeControlBarHeight -
        topAndBottomResumePadding;
      const fallbackResumeHeightPx = fallbackResumeHeightRem * PX_PER_REM;
      const height = documentSize === "A4" ? A4_HEIGHT_PX : LETTER_HEIGHT_PX;
      const width = documentSize === "A4" ? A4_WIDTH_PX : LETTER_WIDTH_PX;
      const previewContentHeightPx = getPreviewContentHeightPx();
      const heightScale =
        (previewContentHeightPx ?? fallbackResumeHeightPx) / height;
      const previewContentWidthPx = getPreviewContentWidthPx();
      const widthScale = previewContentWidthPx
        ? previewContentWidthPx / width
        : heightScale;
      const defaultScale =
        Math.floor(Math.min(heightScale, widthScale) * 100) / 100;
      return defaultScale;
    };

    const setDefaultScale = () => {
      const defaultScale = getDefaultScale();
      setScale(defaultScale);
    };

    if (scaleOnResize) {
      setDefaultScale();
      window.addEventListener("resize", setDefaultScale);
    }

    const resizeObserver =
      scaleOnResize && previewContainerRef?.current
        ? new ResizeObserver(setDefaultScale)
        : undefined;
    resizeObserver?.observe(previewContainerRef!.current!);

    return () => {
      window.removeEventListener("resize", setDefaultScale);
      resizeObserver?.disconnect();
    };
  }, [setScale, scaleOnResize, documentSize, previewContainerRef]);

  return { scaleOnResize, setScaleOnResize };
};
