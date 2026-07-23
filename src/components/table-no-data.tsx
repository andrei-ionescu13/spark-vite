import { Box, Paper } from '@mui/material';

interface TableNoDataProps {
  colSpan: number;
}

export const TableNoData = ({ colSpan }: TableNoDataProps) => {
  return (
    <tbody>
      <tr>
        <td colSpan={colSpan}>
          <Box sx={{ p: 2 }}>
            <Paper
              sx={{
                py: 10,
                width: '100%',
                backgroundColor: '#202632',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              There is no data available
            </Paper>
          </Box>
        </td>
      </tr>
    </tbody>
  );
};
