import { Fragment, type ReactNode } from "react";
import { Text, View, Link } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { getCJKWrapUnits, valueHasCJKCharacters } from "components/fonts/lib";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { DEBUG_RESUME_PDF_FLAG } from "lib/constants";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";
import {
  parseDescriptionMarkdownLines,
  type DescriptionMarkdownSegment,
} from "lib/description-markdown";

const SECTION_HEADING_MIN_PRESENCE_AHEAD = 36;
const CJK_WRAP_HINT = " ";
const CJK_WRAP_HINT_STYLE: Style = {
  fontSize: 0.01,
  lineHeight: 0.01,
};

const shouldInsertCJKWrapHint = (current: string, next: string) => {
  if (!current.trim() || !next.trim()) return false;
  return valueHasCJKCharacters(current) || valueHasCJKCharacters(next);
};

const renderCJKTextWithWrapHints = (text: string): ReactNode => {
  if (!valueHasCJKCharacters(text)) return text;

  const units = getCJKWrapUnits(text);
  if (units.length <= 1) return text;

  return units.map((unit, idx) => (
    <Fragment key={`${idx}-${unit}`}>
      {unit}
      {idx < units.length - 1 &&
        shouldInsertCJKWrapHint(unit, units[idx + 1]) && (
          <Text style={CJK_WRAP_HINT_STYLE}>{CJK_WRAP_HINT}</Text>
        )}
    </Fragment>
  ));
};

const renderTextChildrenWithWrapHints = (children: ReactNode): ReactNode => {
  if (typeof children === "string") {
    return renderCJKTextWithWrapHints(children);
  }

  if (Array.isArray(children)) {
    return children.map((child, idx) => (
      <Fragment key={idx}>{renderTextChildrenWithWrapHints(child)}</Fragment>
    ));
  }

  return children;
};

export const ResumePDFSection = ({
  themeColor,
  heading,
  style = {},
  children,
}: {
  themeColor?: string;
  heading?: string;
  style?: Style;
  children: ReactNode;
}) => (
  <View
    style={{
      ...styles.flexCol,
      gap: spacing["2.5"],
      marginTop: spacing["6"],
      ...style,
    }}
  >
    {heading && (
      <View
        wrap={false}
        minPresenceAhead={SECTION_HEADING_MIN_PRESENCE_AHEAD}
        style={{ ...styles.flexRow, alignItems: "center" }}
      >
        {themeColor && (
          <View
            style={{
              height: "3.75pt",
              width: "30pt",
              backgroundColor: themeColor,
              marginRight: spacing["3.5"],
            }}
            debug={DEBUG_RESUME_PDF_FLAG}
          />
        )}
        <Text
          style={{
            fontWeight: "bold",
            letterSpacing: "0.3pt", // tracking-wide -> 0.025em * 12 pt = 0.3pt
          }}
          debug={DEBUG_RESUME_PDF_FLAG}
        >
          {heading}
        </Text>
      </View>
    )}
    {children}
  </View>
);

export const ResumePDFText = ({
  bold = false,
  themeColor,
  style = {},
  children,
}: {
  bold?: boolean;
  themeColor?: string;
  style?: Style;
  children: ReactNode;
}) => {
  return (
    <Text
      style={{
        color: themeColor || DEFAULT_FONT_COLOR,
        fontWeight: bold ? "bold" : "normal",
        ...style,
      }}
      debug={DEBUG_RESUME_PDF_FLAG}
    >
      {renderTextChildrenWithWrapHints(children)}
    </Text>
  );
};

export const ResumePDFBulletList = ({
  items,
  showBulletPoints = true,
  isPDF = false,
}: {
  items: string[];
  showBulletPoints?: boolean;
  isPDF?: boolean;
}) => {
  const parsedItems = parseDescriptionMarkdownLines(items, showBulletPoints);

  return (
    <>
      {parsedItems.map((item, idx) => {
        if (item.type === "heading") {
          return (
            <ResumePDFText
              key={idx}
              bold={true}
              style={{
                color: "#404040",
                fontSize: "10pt",
                lineHeight: "1.25",
                marginTop: idx === 0 ? 0 : spacing["1.5"],
                marginBottom: spacing["0.5"],
              }}
            >
              <ResumePDFMarkdownText segments={item.segments} isPDF={isPDF} />
            </ResumePDFText>
          );
        }

        if (item.type === "text") {
          return (
            <ResumePDFText
              key={idx}
              style={{
                lineHeight: "1.4",
                marginTop: idx === 0 ? 0 : spacing["0.5"],
              }}
            >
              <ResumePDFMarkdownText segments={item.segments} isPDF={isPDF} />
            </ResumePDFText>
          );
        }

        return (
          <View
            style={{
              ...styles.flexRow,
              alignItems: "flex-start",
              marginLeft: `${item.level * 12}pt`,
              marginTop: idx === 0 ? 0 : spacing["0.5"],
            }}
            key={idx}
          >
            <ResumePDFText
              style={{
                paddingLeft: spacing["2"],
                paddingRight: spacing["2"],
                lineHeight: "1.4",
              }}
              bold={true}
            >
              {"•"}
            </ResumePDFText>
            {/* A breaking change was introduced causing text layout to be wider than node's width
              https://github.com/diegomura/react-pdf/issues/2182. flexGrow & flexBasis fixes it */}
            <ResumePDFText
              style={{ lineHeight: "1.4", flexGrow: 1, flexBasis: 0 }}
            >
              <ResumePDFMarkdownText segments={item.segments} isPDF={isPDF} />
            </ResumePDFText>
          </View>
        );
      })}
    </>
  );
};

const ResumePDFMarkdownText = ({
  segments,
  isPDF,
}: {
  segments: DescriptionMarkdownSegment[];
  isPDF: boolean;
}) => (
  <>
    {segments.map((segment, idx) => {
      if (segment.type === "text") {
        return (
          <Fragment key={idx}>
            {renderCJKTextWithWrapHints(segment.text)}
          </Fragment>
        );
      }

      return (
        <ResumePDFLink key={idx} src={segment.href} isPDF={isPDF}>
          <ResumePDFText
            themeColor="#2563eb"
            style={{ textDecoration: "underline" }}
          >
            {segment.text}
          </ResumePDFText>
        </ResumePDFLink>
      );
    })}
  </>
);

export const ResumePDFLink = ({
  src,
  isPDF,
  children,
}: {
  src: string;
  isPDF: boolean;
  children: ReactNode;
}) => {
  if (isPDF) {
    return (
      <Link src={src} style={{ textDecoration: "none" }}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={src}
      style={{ textDecoration: "none" }}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

export const ResumeFeaturedSkill = ({
  skill,
  rating,
  themeColor,
  style = {},
}: {
  skill: string;
  rating: number;
  themeColor: string;
  style?: Style;
}) => {
  const numCircles = 5;

  return (
    <View style={{ ...styles.flexRow, alignItems: "center", ...style }}>
      <ResumePDFText style={{ marginRight: spacing[0.5] }}>
        {skill}
      </ResumePDFText>
      {[...Array(numCircles)].map((_, idx) => (
        <View
          key={idx}
          style={{
            height: "9pt",
            width: "9pt",
            marginLeft: "2.25pt",
            backgroundColor: rating >= idx ? themeColor : "#d9d9d9",
            borderRadius: "100%",
          }}
        />
      ))}
    </View>
  );
};
