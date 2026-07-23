import { useParams } from 'react-router';
import { KeysTable } from '../components/keys-table';
import { useSearchProductKeys } from './api';

export const ProductKeys = () => {
  const { id } = useParams<{ id: string }>();
  const { data, refetch, isError, isLoading } = useSearchProductKeys(id);
  const { keys, count } = data || {};

  return (
    <>
      <title>Keys</title>
      <KeysTable
        keys={keys}
        count={count}
        isError={isError}
        isLoading={isLoading}
        refetch={refetch}
        showProductCell={false}
      />
    </>
  );
};
