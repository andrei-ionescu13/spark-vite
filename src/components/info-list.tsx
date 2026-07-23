import type { ListProps } from '@mui/material';
import { List } from '@mui/material';

export const InfoList = (props: ListProps) => {
  return (
    <List
      sx={{
        display: 'grid',
        gap: 2.5,
        width: '100%',
      }}
      disablePadding
      {...props}
    />
  );
};
