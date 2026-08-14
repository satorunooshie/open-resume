export type DescriptionMarkdownSegment =
  | { type: "text"; text: string }
  | { type: "link"; text: string; href: string };

export type DescriptionMarkdownLine =
  | {
      type: "heading";
      segments: DescriptionMarkdownSegment[];
    }
  | {
      type: "bullet";
      level: number;
      segments: DescriptionMarkdownSegment[];
    }
  | {
      type: "text";
      segments: DescriptionMarkdownSegment[];
    };

const MARKDOWN_BULLET_REGEX = /^(\s*)([-*•])\s+(.*)$/;
const MARKDOWN_HEADING_REGEX = /^\s*###(?!#)\s*(\S.*?)\s*$/;
const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\(([^)\s]+)\)/g;

export const lineHasMarkdownBullet = (line: string) => {
  return MARKDOWN_BULLET_REGEX.test(line);
};

export const lineHasDescriptionMarkdownBlock = (line: string) => {
  return lineHasMarkdownBullet(line) || MARKDOWN_HEADING_REGEX.test(line);
};

const getIndentLevel = (leadingWhitespace: string) => {
  const width = leadingWhitespace.replace(/\t/g, "    ").length;
  return Math.min(Math.ceil(width / 4), 4);
};

export const normalizeMarkdownLinkHref = (href: string) => {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return href;
  return `https://${href}`;
};

export const parseDescriptionMarkdownSegments = (
  text: string
): DescriptionMarkdownSegment[] => {
  const segments: DescriptionMarkdownSegment[] = [];
  let lastIndex = 0;
  MARKDOWN_LINK_REGEX.lastIndex = 0;

  let match = MARKDOWN_LINK_REGEX.exec(text);
  while (match) {
    const index = match.index ?? 0;
    const [fullMatch, linkText, href] = match;
    if (index > lastIndex) {
      segments.push({ type: "text", text: text.slice(lastIndex, index) });
    }
    segments.push({
      type: "link",
      text: linkText,
      href: normalizeMarkdownLinkHref(href),
    });
    lastIndex = index + fullMatch.length;
    match = MARKDOWN_LINK_REGEX.exec(text);
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", text: text.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ type: "text", text }];
};

export const parseDescriptionMarkdownLines = (
  lines: string[],
  defaultToBullet = true
): DescriptionMarkdownLine[] => {
  return lines
    .map((line) => {
      const headingMatch = line.match(MARKDOWN_HEADING_REGEX);
      if (headingMatch) {
        const [, text] = headingMatch;
        return {
          type: "heading",
          segments: parseDescriptionMarkdownSegments(text),
        } satisfies DescriptionMarkdownLine;
      }

      const bulletMatch = line.match(MARKDOWN_BULLET_REGEX);
      if (bulletMatch) {
        const [, leadingWhitespace, , text] = bulletMatch;
        return {
          type: "bullet",
          level: getIndentLevel(leadingWhitespace),
          segments: parseDescriptionMarkdownSegments(text),
        } satisfies DescriptionMarkdownLine;
      }

      const text = line.trim();
      if (!text) return undefined;

      if (defaultToBullet) {
        return {
          type: "bullet",
          level: 0,
          segments: parseDescriptionMarkdownSegments(text),
        } satisfies DescriptionMarkdownLine;
      }

      return {
        type: "text",
        segments: parseDescriptionMarkdownSegments(text),
      } satisfies DescriptionMarkdownLine;
    })
    .filter(Boolean) as DescriptionMarkdownLine[];
};
