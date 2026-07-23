import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import { Box, Card, Grid, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import type { PromoCodeFormValues } from '../create/create-promo-code-form ';

export const PromoCodeFormCode = () => {
  const { control } = useFormContext<PromoCodeFormValues>();

  return (
    <Card sx={{ p: 2 }}>
      <Controller
        control={control}
        name="code"
        render={({ field: { onChange, ...rest }, fieldState: { error } }) => (
          <Grid
            container
            spacing={2}
          >
            <Grid size={12}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  color="textPrimary"
                  variant="subtitle1"
                >
                  Discount code
                </Typography>
                <Button
                  color="secondary"
                  variant="text"
                  onClick={() => {
                    onChange(Math.random().toString(36).slice(2).toUpperCase());
                  }}
                >
                  Generate
                </Button>
              </Box>
            </Grid>
            <Grid size={12}>
              <TextInput
                {...rest}
                error={!!error}
                helperText={error?.message}
                fullWidth
                id="code"
                label="Code"
                name="code"
                onChange={onChange}
              />
            </Grid>
          </Grid>
        )}
      />
    </Card>
  );
};
