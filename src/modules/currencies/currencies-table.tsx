import { DataTable } from '@/components/data-table';
import { DataTableHead } from '@/components/data-table-head';
import { SearchInput } from '@/components/search-input';
import { useSearch } from '@/hooks/useSearch';
import type { Currency } from '@/types/currencies';
import { Box, Card, TableBody } from '@mui/material';
import { CurrenciesTableRow } from './currencies-table-row';

interface CurrenciesTableProps {
  currencies?: Currency[];
  count?: number;
  isError: boolean;
  isLoading: boolean;
  refetch: any;
}

const headCells = [
  {
    id: 'name',
    label: 'Name',
    width: '20%',
  },
  {
    id: 'code',
    label: 'Code',
    width: '15%',
  },
  {
    id: 'symbol',
    label: 'Symbol',
    width: '15%',
  },
];

export const CurrenciesTable = ({
  currencies,
  count,
  isError,
  isLoading,
  refetch,
}: CurrenciesTableProps) => {
  const [keyword, handleKeywordChange, handleSearch] = useSearch();

  return (
    <Card>
      <Box sx={{ p: 2 }}>
        <form onSubmit={handleSearch}>
          <SearchInput
            onChange={handleKeywordChange}
            placeholder="Search languages..."
            value={keyword}
          />
        </form>
      </Box>
      <DataTable
        isLoading={isLoading}
        count={count}
        hasError={isError}
        hasNoData={count === 0}
        headCellsCount={headCells.length}
        onRefetchData={refetch}
        headSlot={
          <DataTableHead
            isLoading={isLoading}
            headCells={headCells}
            itemsLength={currencies?.length}
          />
        }
      >
        <TableBody>
          {currencies?.map((currency) => (
            <CurrenciesTableRow
              key={currency._id}
              currency={currency}
            />
          ))}
        </TableBody>
      </DataTable>
    </Card>
  );
};
