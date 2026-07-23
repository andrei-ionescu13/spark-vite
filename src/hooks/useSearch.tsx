import type { ChangeEvent, SyntheticEvent } from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';

const isString = (value: any): value is string => typeof value === 'string';

export const useSearch = (): [
  string,
  (event: ChangeEvent<HTMLInputElement>) => void,
  (
    event: SyntheticEvent,
    extraQuery?: Record<string, string | string[]>
  ) => void,
] => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const keywordSearchParam = searchParams.get('keyword');
  const [keyword, setKeyword] = useState<string>(
    isString(keywordSearchParam) ? keywordSearchParam : ''
  );

  const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setKeyword(event.target.value);
  };

  const handleSearch = (
    event: SyntheticEvent,
    extraQuery?: Record<string, string | string[]>
  ): void => {
    event.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (!!keyword) {
      newSearchParams.set('keyword', keyword);
    } else {
      newSearchParams.delete('keyword');
    }

    if (extraQuery) {
      Object.entries(extraQuery).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          newSearchParams.delete(key);
          value.forEach((item) => {
            newSearchParams.append(key, item);
          });
        } else {
          newSearchParams.set(key, value);
        }
      });
    }

    newSearchParams.delete('page');
    navigate(`${[pathname]}?${newSearchParams.toString()}`);
  };

  useEffect(() => {
    if (isString(keywordSearchParam)) {
      setKeyword(keywordSearchParam);
      return;
    }

    setKeyword('');
  }, [keywordSearchParam]);

  return [keyword, handleKeywordChange, handleSearch];
};
