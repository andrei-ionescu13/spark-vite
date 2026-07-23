import type { TextFieldProps } from '@mui/material';
import { InputAdornment, TextField } from '@mui/material';
import { SearchIcon } from 'lucide-react';

export const SearchInput = (props: TextFieldProps) => (
  <TextField
    fullWidth
    id="query"
    slotProps={{
      input: {
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: 'text.secondary' }} />
          </InputAdornment>
        ),
      },
    }}
    variant="outlined"
    {...props}
  />
);
