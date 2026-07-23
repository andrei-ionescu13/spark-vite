import type { TextFieldProps } from '@mui/material';
import { Box, TextField, Tooltip, Typography } from '@mui/material';
import { InfoIcon } from 'lucide-react';

type TextInputProps = TextFieldProps & {
  info?: string;
};

export const TextInput = ({
  label,
  error,
  size = 'small',
  info,
  ...rest
}: TextInputProps) => {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        {label && (
          <Typography
            variant="body2"
            color={error ? 'error' : 'textPrymary'}
          >
            {label}
          </Typography>
        )}
        {info && (
          <Tooltip title={info}>
            <InfoIcon />
          </Tooltip>
        )}
      </Box>
      <TextField
        error={error}
        size={size}
        {...rest}
      />
    </Box>
  );
};
