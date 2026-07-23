import { PageHeader } from '@/components/page-header';
import { Box, Container } from '@mui/material';
import { PlusIcon } from 'lucide-react';
import { useSearchProducts } from './api';
import { ProductsTable } from './products-table';

export const Products = () => {
  const { data, refetch, isError, isLoading } = useSearchProducts();
  const { products, count } = data || {};

  return (
    <>
      <title>Products</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Products"
            action={{
              href: '/products/create',
              label: 'Add',
              icon: PlusIcon,
            }}
          />
          <ProductsTable
            products={products}
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
