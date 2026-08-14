import { View } from "@react-pdf/renderer";
import {
  ResumePDFIcon,
  type IconType,
} from "components/Resume/ResumePDF/common/ResumePDFIcon";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import {
  ResumePDFLink,
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import type { ResumeProfile } from "lib/redux/types";
import { getProfileUrls } from "lib/redux/profile";
import { getUrlHref } from "lib/url";

const getUrlIconType = (url: string): IconType => {
  const normalizedUrl = url.toLowerCase();
  if (normalizedUrl.includes("github")) {
    return "url_github";
  }
  if (normalizedUrl.includes("linkedin")) {
    return "url_linkedin";
  }
  return "url";
};

export const ResumePDFProfile = ({
  profile,
  themeColor,
  isPDF,
}: {
  profile: ResumeProfile;
  themeColor: string;
  isPDF: boolean;
}) => {
  const { name, email, phone, summary, location } = profile;
  const contactItems: ProfileItem[] = [
    email && {
      key: "email",
      value: email,
      iconType: "email",
      src: `mailto:${email}`,
    },
    phone && {
      key: "phone",
      value: phone,
      iconType: "phone",
      src: `tel:${phone.replace(/[^\d+]/g, "")}`,
    },
    location && {
      key: "location",
      value: location,
      iconType: "location",
    },
  ].filter(Boolean) as ProfileItem[];
  const linkItems: ProfileItem[] = getProfileUrls(profile).map((url, idx) => ({
    key: `url-${idx}`,
    value: url,
    iconType: getUrlIconType(url),
    src: getUrlHref(url),
  }));

  return (
    <ResumePDFSection style={{ marginTop: spacing[0] }}>
      <ResumePDFText
        bold={true}
        themeColor={themeColor}
        style={{ fontSize: "20pt" }}
      >
        {name}
      </ResumePDFText>
      {summary && (
        <ResumePDFText style={{ lineHeight: "1.4" }}>{summary}</ResumePDFText>
      )}
      {(contactItems.length > 0 || linkItems.length > 0) && (
        <View
          style={{
            ...styles.flexCol,
            marginTop: spacing["1"],
            paddingBottom: spacing["2"],
            borderBottomWidth: "0.5pt",
            borderBottomColor: "#e5e7eb",
          }}
        >
          {contactItems.length > 0 && (
            <ProfileItemRow
              items={contactItems}
              isPDF={isPDF}
              alignRight={true}
            />
          )}
          {linkItems.length > 0 && (
            <ProfileItemRow
              items={linkItems}
              isPDF={isPDF}
              alignRight={true}
              isLinkRow={true}
              style={{
                marginTop: contactItems.length > 0 ? spacing["1"] : 0,
              }}
            />
          )}
        </View>
      )}
    </ResumePDFSection>
  );
};

type ProfileItem = {
  key: string;
  value: string;
  iconType: IconType;
  src?: string;
};

const ProfileItemRow = ({
  items,
  isPDF,
  alignRight = false,
  isLinkRow = false,
  style = {},
}: {
  items: ProfileItem[];
  isPDF: boolean;
  alignRight?: boolean;
  isLinkRow?: boolean;
  style?: React.ComponentProps<typeof View>["style"];
}) => {
  return (
    <View
      style={{
        ...styles.flexRow,
        flexWrap: "wrap",
        justifyContent: alignRight ? "flex-end" : "flex-start",
        ...style,
      }}
    >
      {items.map(({ key, value, iconType, src }) => {
        const Wrapper = ({ children }: { children: React.ReactNode }) => {
          if (!src) return <>{children}</>;

          return (
            <ResumePDFLink src={src} isPDF={isPDF}>
              {children}
            </ResumePDFLink>
          );
        };

        return (
          <View
            key={key}
            style={{
              ...styles.flexRow,
              alignItems: "center",
              gap: spacing["1"],
              marginLeft: alignRight ? spacing["3.5"] : 0,
              marginRight: alignRight ? 0 : spacing["4"],
              marginBottom: spacing["0.5"],
            }}
          >
            <ResumePDFIcon type={iconType} isPDF={isPDF} />
            <Wrapper>
              <ResumePDFText
                themeColor={isLinkRow ? "#2563eb" : undefined}
                style={{ lineHeight: "1.25" }}
              >
                {value}
              </ResumePDFText>
            </Wrapper>
          </View>
        );
      })}
    </View>
  );
};
