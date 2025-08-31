const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_SITE_URL || '';
  }
  return process.env.NEXT_PUBLIC_SITE_URL;
};

export const BASE_API_URL = getBaseUrl();
