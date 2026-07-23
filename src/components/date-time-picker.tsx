import { Box, Typography } from '@mui/material';
import {
  DateTimePicker,
  type DateTimePickerProps,
} from '@mui/x-date-pickers/DateTimePicker';

interface DateTimeInputProps extends DateTimePickerProps {
  error?: string;
  size?: 'small' | 'medium';
}

export const DateTimeInput = (props: DateTimeInputProps) => {
  const { label, slotProps, size = 'small', error, ...rest } = props;

  return (
    <Box>
      {label && (
        <Typography
          variant="body2"
          color={error ? 'error' : 'textPrimary'}
          sx={{ mb: 0.5 }}
        >
          {label}
        </Typography>
      )}

      <DateTimePicker
        slotProps={{
          textField: {
            size: size,
            error: !!error,
            helperText: error,
          },
        }}
        {...rest}
      />
    </Box>
  );
};
