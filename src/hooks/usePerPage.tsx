import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';

const isString = (value: any): value is string => typeof value === 'string';

export const useLimit = (): [
  number,
  (event: ChangeEvent<HTMLInputElement>) => void,
] => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  let query: any = {};

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  const [limit, setPerPage] = useState<number>(
    isString(query.limit) ? Number.parseInt(query.limit) : 10
  );

  const handlePerPageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = Number.parseInt(event.target.value);
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (value === 10) {
      newSearchParams.delete('limit');
    } else {
      newSearchParams.set('limit', event.target.value);
    }

    newSearchParams.delete('page');
    navigate(`${pathname}?${newSearchParams.toString()}`);
  };

  useEffect(() => {
    setPerPage(isString(query.limit) ? Number.parseInt(query.limit) : 10);
  }, [query]);

  return [limit, handlePerPageChange];
};
