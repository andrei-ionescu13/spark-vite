import { Box, Container } from '@mui/material';
import { useParams } from 'react-router';
import { useGetCollectionQuery } from './api';
import { CollectionHeader } from './collection-header';
import { UpdateCollectionForm } from './update-collection-form';

export const Collection = () => {
  const { id } = useParams<{ id: string }>();
  const { data: collection } = useGetCollectionQuery(id);

  return (
    <>
      <title>Collection</title>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <CollectionHeader />
          {collection && <UpdateCollectionForm collection={collection} />}
        </Container>
      </Box>
    </>
  );
};
