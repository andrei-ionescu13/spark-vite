import { Box, Container } from '@mui/material';
import { useSearchCurrencies } from './api';
import { CurrenciesHeader } from './currencies-header';
import { CurrenciesTable } from './currencies-table';

export const Currencies = () => {
  const { data, refetch, isError, isLoading } = useSearchCurrencies();
  const { currencies, count } = data || {};

  return (
    <>
      <title>Currencies</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <CurrenciesHeader />
          <CurrenciesTable
            currencies={currencies}
            count={count}
            isError={isError}
            isLoading={isLoading}
            refetch={refetch}
          />
        </Container>
      </Box>
    </>
  );
};
