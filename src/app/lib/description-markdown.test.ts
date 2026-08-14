import {
  normalizeMarkdownLinkHref,
  parseDescriptionMarkdownLines,
} from "lib/description-markdown";

describe("description markdown", () => {
  test("parses level 3 markdown headings", () => {
    expect(
      parseDescriptionMarkdownLines(["### Key responsibilities"])
    ).toMatchObject([
      {
        type: "heading",
        segments: [{ type: "text", text: "Key responsibilities" }],
      },
    ]);
  });

  test("parses level 3 markdown headings without a separating space", () => {
    expect(parseDescriptionMarkdownLines(["###主な担当"])).toMatchObject([
      {
        type: "heading",
        segments: [{ type: "text", text: "主な担当" }],
      },
    ]);
  });

  test("only parses triple-hash headings", () => {
    expect(parseDescriptionMarkdownLines(["## Too large"])).toMatchObject([
      {
        type: "bullet",
        segments: [{ type: "text", text: "## Too large" }],
      },
    ]);

    expect(parseDescriptionMarkdownLines(["#### Too deep"])).toMatchObject([
      {
        type: "bullet",
        segments: [{ type: "text", text: "#### Too deep" }],
      },
    ]);
  });

  test("parses nested markdown bullets", () => {
    expect(
      parseDescriptionMarkdownLines(["- aaa", "    - bbbb"])
    ).toMatchObject([
      { type: "bullet", level: 0, segments: [{ type: "text", text: "aaa" }] },
      { type: "bullet", level: 1, segments: [{ type: "text", text: "bbbb" }] },
    ]);
  });

  test("treats legacy description lines as bullets by default", () => {
    expect(parseDescriptionMarkdownLines(["legacy line"])).toMatchObject([
      {
        type: "bullet",
        level: 0,
        segments: [{ type: "text", text: "legacy line" }],
      },
    ]);
  });

  test("treats plain lines as text when default bullets are disabled", () => {
    expect(parseDescriptionMarkdownLines(["plain line"], false)).toMatchObject([
      {
        type: "text",
        segments: [{ type: "text", text: "plain line" }],
      },
    ]);
  });

  test("parses markdown links", () => {
    expect(
      parseDescriptionMarkdownLines(["- See [GitHub](github.com/example)"])[0]
    ).toMatchObject({
      type: "bullet",
      segments: [
        { type: "text", text: "See " },
        { type: "link", text: "GitHub", href: "https://github.com/example" },
      ],
    });
  });

  test("keeps markdown bold as plain text", () => {
    expect(
      parseDescriptionMarkdownLines(["- Improved **payment flows**"])[0]
    ).toMatchObject({
      type: "bullet",
      segments: [{ type: "text", text: "Improved **payment flows**" }],
    });
  });

  test("keeps markdown italic as plain text", () => {
    expect(
      parseDescriptionMarkdownLines(["- Keep *italic* literal"])[0]
    ).toMatchObject({
      type: "bullet",
      segments: [{ type: "text", text: "Keep *italic* literal" }],
    });
  });

  test("keeps explicit link protocols", () => {
    expect(normalizeMarkdownLinkHref("mailto:hello@example.com")).toBe(
      "mailto:hello@example.com"
    );
  });
});
