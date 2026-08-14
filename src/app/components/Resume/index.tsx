"use client";
import { useState, useMemo, useRef } from "react";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { ResumePDF } from "components/Resume/ResumePDF";
import {
  ResumeControlBarCSR,
  ResumeControlBarBorder,
} from "components/Resume/ResumeControlBar";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import { DEBUG_RESUME_PDF_FLAG } from "lib/constants";
import {
  useRegisterReactPDFFont,
  useRegisterReactPDFHyphenationCallback,
} from "components/fonts/hooks";
import { NonEnglishFontsCSSLazyLoader } from "components/fonts/NonEnglishFontsCSSLoader";
import { getResumePDFTextFontFamily } from "components/fonts/lib";

export const Resume = () => {
  const [scale, setScale] = useState(0.8);
  const previewContainerRef = useRef<HTMLElement>(null);
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const resumePDFTextFontFamily = useMemo(
    () => getResumePDFTextFontFamily(resume, settings.fontFamily, settings),
    [resume, settings]
  );
  const document = useMemo(
    () => <ResumePDF resume={resume} settings={settings} isPDF={true} />,
    [resume, settings]
  );

  useRegisterReactPDFFont();
  useRegisterReactPDFHyphenationCallback(resumePDFTextFontFamily);

  return (
    <>
      <NonEnglishFontsCSSLazyLoader />
      <div className="relative flex min-w-0 justify-center md:justify-start">
        <ResumeControlBarBorder />
        <FlexboxSpacer maxWidth={50} className="hidden md:block" />
        <div className="relative min-w-0 flex-1">
          <section
            ref={previewContainerRef}
            className="flex h-[calc(100vh-var(--top-nav-bar-height)-var(--resume-control-bar-height))] min-w-0 items-start justify-center overflow-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-200 md:p-[var(--resume-padding)]"
          >
            <ResumeIframeCSR
              documentSize={settings.documentSize}
              scale={scale}
              enablePDFViewer={DEBUG_RESUME_PDF_FLAG}
            >
              <ResumePDF
                resume={resume}
                settings={settings}
                isPDF={DEBUG_RESUME_PDF_FLAG}
              />
            </ResumeIframeCSR>
          </section>
          <ResumeControlBarCSR
            scale={scale}
            setScale={setScale}
            documentSize={settings.documentSize}
            document={document}
            resume={resume}
            settings={settings}
            fileName={resume.profile.name + " - Resume"}
            previewContainerRef={previewContainerRef}
          />
        </div>
      </div>
    </>
  );
};
