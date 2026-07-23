import type { TableRowProps } from '@mui/material';
import { alpha, TableRow } from '@mui/material';

interface DataTableRowProps extends TableRowProps {
  selected?: boolean;
}

export const DataTableRow = ({
  selected = false,
  ...rest
}: DataTableRowProps) => {
  return (
    <TableRow
      sx={{
        backgroundColor: (theme) =>
          selected ? alpha(theme.palette.primary.main, 0.12) : undefined,
        '&:hover': {
          backgroundColor: (theme) =>
            selected
              ? alpha(theme.palette.primary.main, 0.12)
              : theme.palette.mode === 'light'
                ? 'rgba(0, 0, 0, 0.04)'
                : 'rgba(255, 255, 255, 0.04)',
        },
      }}
      {...rest}
    />
  );
};
