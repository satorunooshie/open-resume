import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  Textarea,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeWorkExperiences,
  selectWorkExperiences,
} from "lib/redux/resumeSlice";
import type { ResumeWorkExperience } from "lib/redux/types";

export const WorkExperiencesForm = () => {
  const workExperiences = useAppSelector(selectWorkExperiences);
  const dispatch = useAppDispatch();

  const showDelete = workExperiences.length > 1;

  return (
    <Form form="workExperiences" addButtonText="Add Job">
      {workExperiences.map(
        (
          {
            company,
            companyUrl = "",
            companyDescription = "",
            jobTitle,
            date,
            summary = "",
            descriptions,
          },
          idx
        ) => {
          const handleWorkExperienceChange = (
            ...[
              field,
              value,
            ]: CreateHandleChangeArgsWithDescriptions<ResumeWorkExperience>
          ) => {
            // TS doesn't support passing union type to single call signature
            // https://github.com/microsoft/TypeScript/issues/54027
            // any is used here as a workaround
            dispatch(changeWorkExperiences({ idx, field, value } as any));
          };
          const showMoveUp = idx !== 0;
          const showMoveDown = idx !== workExperiences.length - 1;

          return (
            <FormSection
              key={idx}
              form="workExperiences"
              idx={idx}
              showMoveUp={showMoveUp}
              showMoveDown={showMoveDown}
              showDelete={showDelete}
              deleteButtonTooltipText="Delete job"
            >
              <Input
                label="Company"
                labelClassName="col-span-full"
                name="company"
                placeholder="Khan Academy"
                value={company}
                onChange={handleWorkExperienceChange}
              />
              <Input
                label="Company URL"
                labelClassName="col-span-full"
                name="companyUrl"
                placeholder="khanacademy.org"
                value={companyUrl}
                onChange={handleWorkExperienceChange}
              />
              <Textarea
                label="Company Description"
                labelClassName="col-span-full"
                name="companyDescription"
                placeholder="Brief company overview, industry, product, size, or market"
                value={companyDescription}
                onChange={handleWorkExperienceChange}
              />
              <Input
                label="Job Title"
                labelClassName="col-span-4"
                name="jobTitle"
                placeholder="Software Engineer"
                value={jobTitle}
                onChange={handleWorkExperienceChange}
              />
              <Input
                label="Date"
                labelClassName="col-span-2"
                name="date"
                placeholder="Jun 2022 - Present"
                value={date}
                onChange={handleWorkExperienceChange}
              />
              <Textarea
                label="Summary"
                labelClassName="col-span-full"
                name="summary"
                placeholder="Short summary of your role, ownership, or impact"
                value={summary}
                onChange={handleWorkExperienceChange}
              />
              <BulletListTextarea
                label="Description"
                labelClassName="col-span-full"
                name="descriptions"
                placeholder="Bullet points"
                value={descriptions}
                onChange={handleWorkExperienceChange}
                showHeadingButton={true}
              />
            </FormSection>
          );
        }
      )}
    </Form>
  );
};
