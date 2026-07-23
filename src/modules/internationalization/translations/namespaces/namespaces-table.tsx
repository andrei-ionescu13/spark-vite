import { DataTable } from '@/components/data-table';
import type { HeadCell } from '@/components/data-table-head';
import { DataTableHead } from '@/components/data-table-head';
import { SearchInput } from '@/components/search-input';
import { useQueryMultipleValues } from '@/hooks/useQueryValue';
import { useSearch } from '@/hooks/useSearch';
import { useSearchParamsQuery } from '@/hooks/useSearchParamsQuery';
import type { Language, Namespace } from '@/types/translations';
import { Box, Card, TableBody } from '@mui/material';
import { useState } from 'react';
import { LanguagesMenu } from '../languages-menu';
import { NamespacesTableRow } from './namespaces-table-row';

interface NamespacesTableProps {
  languages?: Language[];
  namespaces?: Namespace[];
  count?: number;
  isLoading: boolean;
  isError: boolean;
  refetch: any;
}

const headCells: HeadCell[] = [
  {
    id: 'name',
    label: 'Namespace',
  },
];

export const NamespacesTable = ({
  languages,
  namespaces,
  count,
  isLoading,
  isError,
  refetch,
}: NamespacesTableProps) => {
  const query = useSearchParamsQuery();
  const [keyword, handleKeywordChange, handleSearch] = useSearch();
  const [selectedLanguagesParam] = useQueryMultipleValues('language');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    selectedLanguagesParam
  );

  const shownLanguageCodes = (() => {
    if (query?.language) {
      if (typeof query.language === 'string') {
        return [query.language];
      }

      return query.language;
    }

    if (languages) {
      return languages.map((language) => language.code);
    }

    return [];
  })();

  const handleSelectLanguage = (_: any, languageCode: string) => {
    if (selectedLanguages.includes(languageCode)) {
      setSelectedLanguages(
        selectedLanguages.filter((code) => code !== languageCode)
      );
      return;
    }

    setSelectedLanguages([...selectedLanguages, languageCode]);
  };

  const shownLanguages = languages?.filter((language) =>
    shownLanguageCodes?.includes(language.code)
  );

  return (
    <>
      <Card>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              sm: '1fr 160px',
            },
            p: 2,
          }}
        >
          <form
            onSubmit={(event) => {
              handleSearch(event, {
                language: selectedLanguages,
              });
            }}
          >
            <SearchInput
              onChange={handleKeywordChange}
              placeholder="Search..."
              value={keyword}
            />
          </form>
          <LanguagesMenu
            languages={languages || []}
            selectedLanguageCodes={selectedLanguages}
            onSelect={handleSelectLanguage}
          />
        </Box>
        <DataTable
          count={count}
          headSlot={<DataTableHead headCells={headCells} />}
          isLoading={isLoading}
          headCellsCount={1}
          hasCheckbox={false}
          hasError={isError}
          hasNoData={count === 0}
          onRefetchData={refetch}
        >
          <TableBody>
            {namespaces?.map((namespace) => (
              <NamespacesTableRow
                keyword={keyword}
                languages={languages || []}
                namespace={namespace}
                key={namespace.name}
                shownLanguages={shownLanguages || []}
              />
            ))}
          </TableBody>
        </DataTable>
      </Card>
    </>
  );
};
