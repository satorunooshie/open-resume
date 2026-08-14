import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
  ResumePDFLink,
} from "components/Resume/ResumePDF/common";
import { ResumePDFIcon } from "components/Resume/ResumePDF/common/ResumePDFIcon";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeProject } from "lib/redux/types";
import { getUrlHref } from "lib/url";

export const ResumePDFProject = ({
  heading,
  projects,
  themeColor,
  isPDF,
}: {
  heading: string;
  projects: ResumeProject[];
  themeColor: string;
  isPDF: boolean;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {projects.map(
        (
          { project, projectUrl = "", date, summary = "", descriptions },
          idx
        ) => {
          const projectUrlLabel = projectUrl.trim();
          const projectUrlHref = getUrlHref(projectUrlLabel);

          return (
            <View
              key={idx}
              style={{
                ...styles.flexCol,
                ...(idx !== 0 ? { marginTop: spacing["3"] } : {}),
              }}
            >
              {idx > 0 && (
                <View
                  style={{
                    height: "0.5pt",
                    backgroundColor: "#e5e7eb",
                    marginBottom: spacing["3"],
                  }}
                />
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
                  marginTop: spacing["0.5"],
                }}
              >
                <View
                  style={{
                    flexGrow: 1,
                    flexBasis: 0,
                    paddingRight: spacing["2"],
                  }}
                >
                  {projectUrlHref ? (
                    <ResumePDFLink src={projectUrlHref} isPDF={isPDF}>
                      <ResumePDFText
                        bold={true}
                        style={{
                          fontSize: "11.5pt",
                          lineHeight: "1.25",
                        }}
                      >
                        {project}
                      </ResumePDFText>
                    </ResumePDFLink>
                  ) : (
                    <ResumePDFText
                      bold={true}
                      style={{
                        fontSize: "11.5pt",
                        lineHeight: "1.25",
                      }}
                    >
                      {project}
                    </ResumePDFText>
                  )}
                </View>
                <ResumePDFText style={{ color: "#525252", flexShrink: 0 }}>
                  {date}
                </ResumePDFText>
              </View>
              {projectUrlLabel && projectUrlHref && (
                <View
                  style={{
                    ...styles.flexRow,
                    alignItems: "center",
                    gap: spacing["1"],
                    marginTop: spacing["1"],
                  }}
                >
                  <ResumePDFIcon type="url" isPDF={isPDF} />
                  <ResumePDFLink src={projectUrlHref} isPDF={isPDF}>
                    <ResumePDFText
                      themeColor="#2563eb"
                      style={{
                        fontSize: "9pt",
                        lineHeight: "1.25",
                        textDecoration: "underline",
                      }}
                    >
                      {projectUrlLabel}
                    </ResumePDFText>
                  </ResumePDFLink>
                </View>
              )}
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
        }
      )}
    </ResumePDFSection>
  );
};
