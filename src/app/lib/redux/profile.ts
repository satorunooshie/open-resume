import type { ResumeProfile } from "lib/redux/types";

type ProfileWithMaybeUrls = Pick<ResumeProfile, "url"> &
  Partial<Pick<ResumeProfile, "urls">>;

const getRawProfileUrls = (profile: ProfileWithMaybeUrls) => {
  if (profile.urls && profile.urls.length > 0) {
    return [...profile.urls];
  }
  return profile.url ? [profile.url] : [];
};

export const getProfileUrlInputValues = (profile: ProfileWithMaybeUrls) => {
  const urls = getRawProfileUrls(profile);
  return urls.length > 0 ? urls : [""];
};

export const getProfileUrls = (profile: ProfileWithMaybeUrls) => {
  return getRawProfileUrls(profile).filter((url) => url.trim());
};

export const normalizeProfileUrls = (profile: ResumeProfile) => {
  const urls = getProfileUrlInputValues(profile);
  profile.urls = urls;
  profile.url = urls[0] ?? "";
};
