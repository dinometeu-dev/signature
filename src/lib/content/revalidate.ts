import { revalidateTag } from 'next/cache';

import { CACHE_TAGS } from '@/lib/cache-tags';

export function revalidatePortfolioContent(
  ...tags: Array<(typeof CACHE_TAGS)[keyof typeof CACHE_TAGS]>
) {
  const uniqueTags = [...new Set(tags)];

  uniqueTags.forEach((tag) => {
    revalidateTag(tag, 'max');
  });
}
