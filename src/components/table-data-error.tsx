import { Box, Paper } from '@mui/material';
import { RefreshCwIcon } from 'lucide-react';
import { Button } from './button';

interface DataErrorProps {
  onRefetch: () => void;
  colSpan: number;
}

export const TableDataError = ({
  onRefetch: onReload,
  colSpan,
}: DataErrorProps) => {
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
              <p>An error has occurred</p>
              <Button
                onClick={onReload}
                color="error"
                variant="contained"
                sx={{
                  display: 'inline-flex',
                  alignContent: 'center',
                  gap: 2,
                }}
              >
                <RefreshCwIcon sx={{ mr: 1 }} />
                Reload data
              </Button>
            </Paper>
          </Box>
        </td>
      </tr>
    </tbody>
  );
};
