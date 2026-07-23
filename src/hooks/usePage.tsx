import { isString } from '@/utils/is-string';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useSearchParamsQuery } from './useSearchParamsQuery';

export const usePage = (): [
  number,
  (event: unknown, newPage: number) => void,
] => {
  const { pathname } = useLocation();
  const searchParams = useParams();
  const query = useSearchParamsQuery();
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(() => {
    const parsedPage = isString(query.page) ? Number.parseInt(query.page) : 0;

    if (parsedPage > 1) {
      return parsedPage - 1;
    }

    return 0;
  });

  const handlePageChange = (event: unknown, newPage: number): void => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (newPage === 0) {
      newSearchParams.delete('page');
    } else {
      newSearchParams.set('page', (newPage + 1).toString());
    }

    navigate(`${pathname}?${newSearchParams.toString()}`);
  };

  useEffect(() => {
    const page = isString(query.page) ? Number.parseInt(query.page) : 0;

    if (page > 1) {
      setPage(page - 1);
      return;
    }

    setPage(0);
  }, [query]);

  return [page, handlePageChange];
};
