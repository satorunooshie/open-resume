export const getUrlHref = (url: string) => {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return "";

  return /^https?:\/\//i.test(trimmedUrl)
    ? trimmedUrl
    : `https://${trimmedUrl}`;
};
