export const CACHE_TAGS = {
  signature: 'portfolio:signature',
  profile: 'portfolio:profile',
  works: 'portfolio:works',
} as const;

export const PUBLIC_CACHE_TAGS = Object.values(CACHE_TAGS);
