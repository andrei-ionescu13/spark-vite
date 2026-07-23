import { PageHeader } from '@/components/page-header';
import { Box, Container } from '@mui/material';
import { CreateCollectionForm } from './create-collection-form';

const CollectionCreate = () => {
  return (
    <>
      <title>Collection Create</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PageHeader
            backHref="/products/collections"
            backLabel="Collections"
            title="Create collection"
          />
          <CreateCollectionForm />
        </Container>
      </Box>
    </>
  );
};

export default CollectionCreate;
