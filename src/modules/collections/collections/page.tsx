import { PageHeader } from '@/components/page-header';
import { Box, Container } from '@mui/material';
import { PlusIcon } from 'lucide-react';
import { useSearchCollectionsQuery } from './api';
import { CollectionsTable } from './collections-table';

export const Collections = () => {
  const { data, refetch, isError, isLoading } = useSearchCollectionsQuery();
  const { collections, count } = data || {};

  return (
    <>
      <title>Collections</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Collections"
            action={{
              href: '/products/collections/create',
              label: 'Create',
              icon: PlusIcon,
            }}
          />
          <CollectionsTable
            collections={collections}
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
