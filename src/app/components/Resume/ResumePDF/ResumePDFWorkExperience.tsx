import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
  ResumePDFLink,
} from "components/Resume/ResumePDF/common";
import { ResumePDFIcon } from "components/Resume/ResumePDF/common/ResumePDFIcon";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeWorkExperience } from "lib/redux/types";
import { getUrlHref } from "lib/url";

export const ResumePDFWorkExperience = ({
  heading,
  workExperiences,
  themeColor,
  isPDF,
}: {
  heading: string;
  workExperiences: ResumeWorkExperience[];
  themeColor: string;
  isPDF: boolean;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {workExperiences.map((workExperience, idx) => {
        const {
          company,
          companyUrl,
          companyDescription,
          jobTitle,
          date,
          summary,
          descriptions,
        } = workExperience;
        const previousWorkExperience = workExperiences[idx - 1];
        const companyUrlLabel = companyUrl?.trim() ?? "";
        const hideCompanyName = Boolean(
          idx > 0 &&
            company &&
            company === previousWorkExperience.company &&
            companyUrlLabel ===
              (previousWorkExperience.companyUrl?.trim() ?? "") &&
            companyDescription ===
              (previousWorkExperience.companyDescription ?? "")
        );
        const showCompanyDivider = idx > 0 && !hideCompanyName;
        const companyUrlHref = getUrlHref(companyUrlLabel);

        return (
          <View
            key={idx}
            style={{
              ...styles.flexCol,
              ...(idx !== 0 ? { marginTop: spacing["3"] } : {}),
            }}
          >
            {showCompanyDivider && (
              <View
                style={{
                  height: "0.5pt",
                  backgroundColor: "#e5e7eb",
                  marginBottom: spacing["3"],
                }}
              />
            )}
            {!hideCompanyName &&
              (company || companyUrlLabel || companyDescription) && (
                <View style={{ ...styles.flexCol }}>
                  {company &&
                    (companyUrlHref ? (
                      <ResumePDFLink src={companyUrlHref} isPDF={isPDF}>
                        <ResumePDFText
                          bold={true}
                          style={{ fontSize: "12.5pt", lineHeight: "1.25" }}
                        >
                          {company}
                        </ResumePDFText>
                      </ResumePDFLink>
                    ) : (
                      <ResumePDFText
                        bold={true}
                        style={{ fontSize: "12.5pt", lineHeight: "1.25" }}
                      >
                        {company}
                      </ResumePDFText>
                    ))}
                  {companyUrlLabel && companyUrlHref && (
                    <View
                      style={{
                        ...styles.flexRow,
                        alignItems: "center",
                        gap: spacing["1"],
                        marginTop: spacing["0.5"],
                      }}
                    >
                      <ResumePDFIcon type="url" isPDF={isPDF} />
                      <ResumePDFLink src={companyUrlHref} isPDF={isPDF}>
                        <ResumePDFText
                          themeColor="#2563eb"
                          style={{
                            fontSize: "9pt",
                            lineHeight: "1.25",
                            textDecoration: "underline",
                          }}
                        >
                          {companyUrlLabel}
                        </ResumePDFText>
                      </ResumePDFLink>
                    </View>
                  )}
                  {companyDescription && (
                    <ResumePDFText
                      style={{ lineHeight: "1.4", marginTop: spacing["1"] }}
                    >
                      {companyDescription}
                    </ResumePDFText>
                  )}
                </View>
              )}
            <View
              wrap={false}
              style={{
                ...styles.flexRowBetween,
                alignItems: "flex-start",
                gap: spacing["3"],
                borderBottomWidth: "0.5pt",
                borderBottomColor: "#e5e7eb",
                paddingBottom: spacing["1"],
                marginTop: hideCompanyName ? spacing["1"] : spacing["2"],
              }}
            >
              <ResumePDFText
                bold={true}
                style={{
                  fontSize: "11.5pt",
                  lineHeight: "1.25",
                  flexGrow: 1,
                  flexBasis: 0,
                  paddingRight: spacing["2"],
                }}
              >
                {jobTitle}
              </ResumePDFText>
              <ResumePDFText style={{ color: "#525252", flexShrink: 0 }}>
                {date}
              </ResumePDFText>
            </View>
            {summary && (
              <ResumePDFText
                style={{ lineHeight: "1.4", marginTop: spacing["1.5"] }}
              >
                {summary}
              </ResumePDFText>
            )}
            <View style={{ ...styles.flexCol, marginTop: spacing["2"] }}>
              <ResumePDFBulletList items={descriptions} isPDF={isPDF} />
            </View>
          </View>
        );
      })}
    </ResumePDFSection>
  );
};
