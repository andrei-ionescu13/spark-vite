import type { ArticleCategory } from '@/types/article-category';
import type { ArticleTag } from '@/types/article-tag';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';

export const listArticleCategories = () =>
  appFetch<ArticleCategory[]>({
    url: '/article-categories',
    withAuth: true,
  });

export const listArticleTags = () =>
  appFetch<ArticleTag[]>({
    url: '/article-tags',
    withAuth: true,
  });

export const useDeleteArticle = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, string>({
    mutationFn: (articleId) =>
      appFetch({
        url: `/articles/${articleId}`,
        config: {
          method: 'DELETE',
        },
        withAuth: true,
      }),
    onSuccess,
  });

export const useListArticleCategories = () =>
  useQuery({
    queryKey: ['article-categories'],
    queryFn: listArticleCategories,
  });

export const useListArticleTags = () =>
  useQuery({
    queryKey: ['article-tags'],
    queryFn: listArticleTags,
  });
