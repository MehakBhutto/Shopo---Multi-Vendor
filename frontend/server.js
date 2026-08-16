const backendBaseUrl =
  import.meta.env.VITE_BACKEND_URL || "https://shopo-multi-vendor-backend.vercel.app";

export const server = `${backendBaseUrl}/api/v2`;
export const backend_url = `${backendBaseUrl}/`;

export const getImageUrl = (url) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${backend_url}${url}`;
};
