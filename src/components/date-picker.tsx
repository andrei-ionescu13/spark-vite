import { Box, Typography } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

export const DateInput = (props: any) => {
  const { label, slotProps, ...rest } = props;
  const { textField } = slotProps;
  const { size = 'small', error } = textField;

  return (
    <Box>
      {label && (
        <Typography
          variant="body2"
          color={error ? 'error' : 'textPrymary'}
          sx={{ mb: 1 }}
        >
          {label}
        </Typography>
      )}
      <DesktopDatePicker
        slotProps={{
          ...slotProps,
          textField: {
            size,
            error,
            ...slotProps.textField,
          },
        }}
        {...rest}
      />
    </Box>
  );
};
