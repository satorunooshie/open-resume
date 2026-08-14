import { getUrlHref } from "lib/url";

describe("url helpers", () => {
  test("keeps http and https URLs", () => {
    expect(getUrlHref("https://example.com")).toBe("https://example.com");
    expect(getUrlHref("http://example.com")).toBe("http://example.com");
  });

  test("adds https to bare URLs", () => {
    expect(getUrlHref("example.com")).toBe("https://example.com");
  });

  test("trims URLs and keeps empty URLs empty", () => {
    expect(getUrlHref("  example.com/path  ")).toBe("https://example.com/path");
    expect(getUrlHref("   ")).toBe("");
  });
});
