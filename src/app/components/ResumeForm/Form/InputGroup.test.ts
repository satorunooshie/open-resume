import {
  getBulletListStringsFromTextareaValue,
  getTextareaValueFromBulletListStrings,
} from "components/ResumeForm/Form/bullet-list-textarea";

describe("BulletListTextarea helpers", () => {
  test("does not auto-prefix plain lines with markdown bullets", () => {
    expect(getTextareaValueFromBulletListStrings(["Built a feature"])).toBe(
      "Built a feature"
    );
  });

  test("keeps explicit markdown bullets and headings unchanged", () => {
    expect(
      getTextareaValueFromBulletListStrings([
        "### Responsibilities",
        "- Parent item",
        "    - Child item",
      ])
    ).toBe("### Responsibilities\n- Parent item\n    - Child item");
  });

  test("stores textarea lines exactly as typed", () => {
    expect(
      getBulletListStringsFromTextareaValue(
        "- Parent item\n    - Child item\nPlain line"
      )
    ).toEqual(["- Parent item", "    - Child item", "Plain line"]);
  });

  test("stores an empty textarea as an empty list", () => {
    expect(getBulletListStringsFromTextareaValue("")).toEqual([]);
  });
});
