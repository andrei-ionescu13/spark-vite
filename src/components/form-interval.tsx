import {
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from '@mui/material';
import type { PickerValue } from '@mui/x-date-pickers/internals';
import dayjs from 'dayjs';
import type { ChangeEvent } from 'react';
import { DateTimeInput } from './date-time-picker';

interface FormIntervalProps {
  shouldSetEndDate: boolean;
  onShouldSetEndDateChange: (event: ChangeEvent<HTMLInputElement>) => void;
  startDate: {
    value?: string;
    onChange: (...args: any[]) => void;
    error?: string;
  };
  endDate: {
    value?: string | null;
    onChange: (...args: any[]) => void;
    error?: string;
  };
}

export const FormInterval = ({
  shouldSetEndDate,
  onShouldSetEndDateChange,
  startDate,
  endDate,
}: FormIntervalProps) => {
  return (
    <Card sx={{ p: 2 }}>
      <Grid
        container
        spacing={2}
      >
        <Grid size={12}>
          <Typography
            color="textPrimary"
            variant="subtitle1"
          >
            Active dates
          </Typography>
        </Grid>
        <Grid size={12}>
          <DateTimeInput
            sx={{ width: '100%' }}
            disablePast
            label="Start date"
            value={startDate.value ? dayjs(startDate.value) : null}
            onChange={(value: PickerValue) => {
              startDate.onChange(value?.toISOString());
            }}
            slotProps={{
              textField: {
                helperText: startDate.error,
              },
            }}
          />
        </Grid>
        <Grid size={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={shouldSetEndDate}
                onChange={onShouldSetEndDateChange}
              />
            }
            label="Set end date"
          />
        </Grid>
        {shouldSetEndDate && (
          <Grid size={12}>
            <DateTimeInput
              sx={{ width: '100%' }}
              disablePast
              label="End date"
              value={endDate.value ? dayjs(endDate.value) : null}
              onChange={(value: PickerValue) => {
                endDate.onChange(value?.toISOString());
              }}
              slotProps={{
                textField: {
                  helperText: endDate.error,
                },
              }}
            />
          </Grid>
        )}
      </Grid>
    </Card>
  );
};
