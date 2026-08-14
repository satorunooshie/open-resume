import { useId } from "react";
import { PlusSmallIcon } from "@heroicons/react/24/outline";
import { useAutosizeTextareaHeight } from "lib/hooks/useAutosizeTextareaHeight";
import {
  getBulletListStringsFromTextareaValue,
  getTextareaValueFromBulletListStrings,
} from "components/ResumeForm/Form/bullet-list-textarea";

interface InputProps<K extends string, V extends string | string[]> {
  label: string;
  labelClassName?: string;
  // name is passed in as a const string. Therefore, we make it a generic type so its type can
  // be more restricted as a const for the first argument in onChange
  name: K;
  value?: V;
  placeholder: string;
  onChange: (name: K, value: V) => void;
}

/**
 * InputGroupWrapper wraps a label element around a input children. This is preferable
 * than having input as a sibling since it makes clicking label auto focus input children
 */
export const InputGroupWrapper = ({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children?: React.ReactNode;
}) => (
  <label className={`text-base font-medium text-gray-700 ${className}`}>
    {label}
    {children}
  </label>
);

export const INPUT_CLASS_NAME =
  "mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base";

export const Input = <K extends string>({
  name,
  value = "",
  placeholder,
  onChange,
  label,
  labelClassName,
}: InputProps<K, string>) => {
  return (
    <InputGroupWrapper label={label} className={labelClassName}>
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        className={INPUT_CLASS_NAME}
      />
    </InputGroupWrapper>
  );
};

export const Textarea = <T extends string>({
  label,
  labelClassName: wrapperClassName,
  name,
  value = "",
  placeholder,
  onChange,
}: InputProps<T, string>) => {
  const textareaRef = useAutosizeTextareaHeight({ value });

  return (
    <InputGroupWrapper label={label} className={wrapperClassName}>
      <textarea
        ref={textareaRef}
        name={name}
        className={`${INPUT_CLASS_NAME} resize-none overflow-hidden`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </InputGroupWrapper>
  );
};

export const BulletListTextarea = <T extends string>({
  label,
  labelClassName,
  name,
  value: bulletListStrings = [],
  placeholder,
  onChange,
  showHeadingButton = false,
}: InputProps<T, string[]> & {
  showBulletPoints?: boolean;
  showHeadingButton?: boolean;
}) => {
  const textareaId = useId();
  const textareaValue =
    getTextareaValueFromBulletListStrings(bulletListStrings);
  const textareaRef = useAutosizeTextareaHeight({ value: textareaValue });

  const handleAddHeadingClick = () => {
    const headingLine = "### Heading";
    const lastLine = bulletListStrings[bulletListStrings.length - 1];
    const nextLines =
      bulletListStrings.length > 0 && !lastLine?.trim()
        ? [...bulletListStrings.slice(0, -1), headingLine]
        : [...bulletListStrings, headingLine];
    onChange(name, nextLines);
  };

  return (
    <div className={`text-base font-medium text-gray-700 ${labelClassName}`}>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={textareaId}>{label}</label>
        {showHeadingButton && (
          <button
            type="button"
            onClick={handleAddHeadingClick}
            className="inline-flex items-center rounded-md bg-white px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <PlusSmallIcon
              className="-ml-0.5 mr-1 h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
            Add heading
          </button>
        )}
      </div>
      <textarea
        id={textareaId}
        ref={textareaRef}
        name={name}
        className={`${INPUT_CLASS_NAME} resize-none overflow-hidden`}
        placeholder={placeholder}
        value={textareaValue}
        onChange={(e) => {
          onChange(name, getBulletListStringsFromTextareaValue(e.target.value));
        }}
      />
    </div>
  );
};
