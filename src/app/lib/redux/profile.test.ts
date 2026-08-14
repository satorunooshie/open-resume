import {
  getProfileUrlInputValues,
  getProfileUrls,
} from "lib/redux/profile";

describe("profile helpers", () => {
  test("uses the legacy url when urls are missing", () => {
    expect(getProfileUrlInputValues({ url: "github.com/open-resume" })).toEqual(
      ["github.com/open-resume"]
    );
  });

  test("keeps one empty input value when there are no links", () => {
    expect(getProfileUrlInputValues({ url: "", urls: [] })).toEqual([""]);
  });

  test("filters empty links for display", () => {
    expect(
      getProfileUrls({
        url: "",
        urls: ["github.com/open-resume", "  ", "blog.example.com"],
      })
    ).toEqual(["github.com/open-resume", "blog.example.com"]);
  });
});
