import type {
  Article,
  ArticleCategory,
  ArticleGeneral,
  ArticleMeta,
  ArticleStatus,
} from '@/types/articles';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';

export const getArticle = (id: string) =>
  appFetch<Article>({
    url: `/articles/${id}`,
    withAuth: true,
  });

export const useGetArticle = (id: string) =>
  useQuery({
    queryKey: ['articles', id],
    queryFn: () => getArticle(id),
  });

interface UpdateArticleGeneral extends ArticleGeneral {
  updatedAt: string;
}

export const useUpdateArticleGeneral = (id: string) =>
  useMutation<UpdateArticleGeneral, Error, BodyInit>({
    mutationFn: (values) =>
      appFetch({
        url: `/articles/${id}/details`,
        config: {
          body: values,
          method: 'PUT',
        },
        noContentType: true,
        withAuth: true,
      }),
  });

interface UpdateArticleMetaData extends ArticleMeta {
  updatedAt: string;
}

export const useUpdateArticleMeta = (id: string) =>
  useMutation<UpdateArticleMetaData, Error, Record<string, any>>({
    mutationFn: (values) =>
      appFetch({
        url: `/articles/${id}/meta`,
        config: {
          body: JSON.stringify(values),
          method: 'PUT',
        },
        withAuth: true,
      }),
  });

export const useUpdateArticleStatus = (id: string) =>
  useMutation<{ status: ArticleStatus }, Error, string>({
    mutationFn: (status) =>
      appFetch({
        url: `/articles/${id}/status`,
        config: {
          body: JSON.stringify({ status }),
          method: 'PUT',
        },
        withAuth: true,
      }),
  });

export const useUpdateArticleCategory = (id: string) =>
  useMutation<{ category: ArticleCategory }, Error, string>({
    mutationFn: (category) =>
      appFetch({
        url: `/articles/${id}/category`,
        config: {
          body: JSON.stringify({ category }),
          method: 'PUT',
        },
        withAuth: true,
      }),
  });

export const useUpdateArticleTags = (id: string) =>
  useMutation<{ category: ArticleCategory }, Error, Record<string, any>>({
    mutationFn: (values) =>
      appFetch({
        url: `/articles/${id}/tags`,
        config: {
          body: JSON.stringify(values),
          method: 'PUT',
        },
        withAuth: true,
      }),
  });
