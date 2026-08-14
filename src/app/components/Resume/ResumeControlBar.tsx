"use client";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useSetDefaultScale } from "components/Resume/hooks";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import { usePDF } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { useAppDispatch } from "lib/redux/hooks";
import { setResume } from "lib/redux/resumeSlice";
import { setSettings, type Settings } from "lib/redux/settingsSlice";
import type { Resume } from "lib/redux/types";
import {
  getResumeDataFileName,
  parseResumeDataFile,
  stringifyResumeDataFile,
} from "lib/resume-data-file";

const CONTROL_BUTTON_CLASS =
  "flex shrink-0 items-center gap-1 rounded-md border border-gray-300 px-3 py-0.5 hover:bg-gray-100";

const ResumeControlBar = ({
  scale,
  setScale,
  documentSize,
  document,
  resume,
  settings,
  fileName,
  previewContainerRef,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  document: JSX.Element;
  resume: Resume;
  settings: Settings;
  fileName: string;
  previewContainerRef?: RefObject<HTMLElement>;
}) => {
  const dispatch = useAppDispatch();
  const dataImportInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState("");
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
    previewContainerRef,
  });

  const [instance, update] = usePDF({ document });
  const resumeDataUrl = useMemo(() => {
    const blob = new Blob([stringifyResumeDataFile(resume, settings)], {
      type: "application/json",
    });
    return URL.createObjectURL(blob);
  }, [resume, settings]);

  // Hook to update pdf when document changes
  useEffect(() => {
    update();
  }, [update, document]);

  useEffect(() => {
    return () => URL.revokeObjectURL(resumeDataUrl);
  }, [resumeDataUrl]);

  const onDataImportChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const data = parseResumeDataFile(await file.text());
      dispatch(setResume(data.resume));
      dispatch(setSettings(data.settings));
      setImportError("");
    } catch (error) {
      setImportError(
        error instanceof Error
          ? error.message
          : "Could not import the selected data file."
      );
    }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 flex h-[var(--resume-control-bar-height)] min-w-0 items-center justify-start overflow-x-auto bg-gray-50 px-[var(--resume-padding)] text-gray-600">
      <div className="flex min-w-0 items-center gap-2">
        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.01}
          value={scale}
          onChange={(e) => {
            setScaleOnResize(false);
            setScale(Number(e.target.value));
          }}
        />
        <div className="w-10">{`${Math.round(scale * 100)}%`}</div>
        <label className="hidden items-center gap-1 lg:flex">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4"
            checked={scaleOnResize}
            onChange={() => setScaleOnResize((prev) => !prev)}
          />
          <span className="select-none">Autoscale</span>
        </label>
      </div>
      <a
        className={`ml-4 ${CONTROL_BUTTON_CLASS}`}
        href={instance.url!}
        download={fileName}
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        <span className="whitespace-nowrap">PDF</span>
      </a>
      <a
        className={CONTROL_BUTTON_CLASS}
        href={resumeDataUrl}
        download={getResumeDataFileName(resume.profile.name)}
      >
        <DocumentArrowDownIcon className="h-4 w-4" />
        <span className="whitespace-nowrap">Export data</span>
      </a>
      <button
        type="button"
        className={CONTROL_BUTTON_CLASS}
        onClick={() => dataImportInputRef.current?.click()}
      >
        <ArrowUpTrayIcon className="h-4 w-4" />
        <span className="whitespace-nowrap">Import data</span>
      </button>
      <input
        ref={dataImportInputRef}
        type="file"
        className="sr-only"
        accept=".json,application/json"
        onChange={onDataImportChange}
      />
      {importError && (
        <div
          className="ml-2 max-w-[16rem] shrink-0 truncate text-xs text-red-500"
          title={importError}
        >
          {importError}
        </div>
      )}
    </div>
  );
};

/**
 * Load ResumeControlBar client side since it uses usePDF, which is a web specific API
 */
export const ResumeControlBarCSR = dynamic(
  () => Promise.resolve(ResumeControlBar),
  {
    ssr: false,
  }
);

export const ResumeControlBarBorder = () => (
  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[var(--resume-control-bar-height)] border-t border-gray-200 bg-gray-50" />
);
