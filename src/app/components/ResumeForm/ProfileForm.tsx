import { BaseForm } from "components/ResumeForm/Form";
import { Input, Textarea } from "components/ResumeForm/Form/InputGroup";
import { DeleteIconButton } from "components/ResumeForm/Form/IconButton";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  addProfileUrl,
  changeProfile,
  changeProfileUrl,
  deleteProfileUrlByIdx,
  selectProfile,
} from "lib/redux/resumeSlice";
import type { ResumeProfile } from "lib/redux/types";
import { getProfileUrlInputValues } from "lib/redux/profile";
import { PlusSmallIcon } from "@heroicons/react/24/outline";

type ResumeProfileStringField = Exclude<keyof ResumeProfile, "urls">;

export const ProfileForm = () => {
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const { name, email, phone, summary, location } = profile;
  const urls = getProfileUrlInputValues(profile);

  const handleProfileChange = (
    field: ResumeProfileStringField,
    value: string
  ) => {
    dispatch(changeProfile({ field, value }));
  };
  const handleProfileUrlChange = (idx: number, value: string) => {
    dispatch(changeProfileUrl({ idx, value }));
  };

  return (
    <BaseForm>
      <div className="grid grid-cols-6 gap-3">
        <Input
          label="Name"
          labelClassName="col-span-full"
          name="name"
          placeholder="Sal Khan"
          value={name}
          onChange={handleProfileChange}
        />
        <Textarea
          label="Objective"
          labelClassName="col-span-full"
          name="summary"
          placeholder="Entrepreneur and educator obsessed with making education free for anyone"
          value={summary}
          onChange={handleProfileChange}
        />
        <Input
          label="Email"
          labelClassName="col-span-4"
          name="email"
          placeholder="hello@khanacademy.org"
          value={email}
          onChange={handleProfileChange}
        />
        <Input
          label="Phone"
          labelClassName="col-span-2"
          name="phone"
          placeholder="(123)456-7890"
          value={phone}
          onChange={handleProfileChange}
        />
        <div className="col-span-4 flex flex-col gap-3">
          {urls.map((url, idx) => (
            <div className="flex items-end gap-1" key={idx}>
              <Input
                label={idx === 0 ? "Link" : `Link ${idx + 1}`}
                labelClassName="grow"
                name="url"
                placeholder={
                  idx === 0
                    ? "linkedin.com/in/khanacademy"
                    : "github.com/khanacademy"
                }
                value={url}
                onChange={(_, value) => handleProfileUrlChange(idx, value)}
              />
              <div
                className={`mb-2 transition-opacity ${
                  urls.length > 1 ? "" : "invisible opacity-0"
                }`}
              >
                <DeleteIconButton
                  onClick={() => dispatch(deleteProfileUrlByIdx({ idx }))}
                  tooltipText="Delete link"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => dispatch(addProfileUrl())}
            className="flex w-fit items-center rounded-md bg-white py-2 pl-3 pr-4 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <PlusSmallIcon
              className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Add Link
          </button>
        </div>
        <Input
          label="Location"
          labelClassName="col-span-2"
          name="location"
          placeholder="NYC, NY"
          value={location}
          onChange={handleProfileChange}
        />
      </div>
    </BaseForm>
  );
};
