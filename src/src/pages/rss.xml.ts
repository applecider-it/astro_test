import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import type { Post } from '@/types/types';

// RSS生成用
export const GET: APIRoute = async (context) => {

  const posts: Post[] = await getCollection('post');

  return rss({
    title: 'サイトブログ',
    description: 'お知らせ',
    site: context.site!, // siteは必須なので ! で型補強
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/article/${post.slug}/`,
    })),
  });
};