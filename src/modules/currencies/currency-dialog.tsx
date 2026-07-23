import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import type { SyntheticEvent } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { useCreateCurrency } from './api';
import currencyOptions from './currencies.json';

type CurrencyOptionKey = keyof typeof currencyOptions;

const schema = z.object({
  code: z.string(),
  name: z.string(),
  symbol: z.string(),
});

type FormData = z.infer<typeof schema>;

const currencyOptionKeys = Object.keys(currencyOptions);
const isCurrencyOptionKey = (x: any): x is CurrencyOptionKey =>
  currencyOptionKeys.includes(x);

interface CurrencyDialogProps {
  open: boolean;
  onClose: any;
}

export const CurrencyDialog = ({ open, onClose }: CurrencyDialogProps) => {
  const queryClient = useQueryClient();
  const createCurrency = useCreateCurrency(() =>
    queryClient.invalidateQueries({ queryKey: ['currencies'] })
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: '',
      name: '',
      symbol: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    createCurrency.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Add currency</DialogTitle>
        <DialogContent sx={{ py: '24px !important' }}>
          <Grid
            container
            spacing={2}
          >
            <Grid size={12}>
              <Controller
                name="code"
                control={control}
                render={({ field: { value, ...rest } }) => {
                  return (
                    <Autocomplete
                      autoHighlight
                      value={watch('code')}
                      filterSelectedOptions
                      id="code"
                      onChange={(
                        event: SyntheticEvent,
                        newValue: string | null
                      ) => {
                        if (!isCurrencyOptionKey(newValue)) return;

                        const selectedCurrency = currencyOptions[newValue];
                        const { code, name, symbol } = selectedCurrency;
                        setValues({ code, name, symbol });
                      }}
                      getOptionLabel={(option: string) => {
                        if (!isCurrencyOptionKey(option)) return '';

                        return currencyOptions?.[option]?.name;
                      }}
                      options={currencyOptionKeys}
                      renderInput={(params) => (
                        <TextInput
                          {...params}
                          {...rest}
                          size="small"
                          label="Currency"
                          name="code"
                        />
                      )}
                    />
                  );
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            color="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            isLoading={createCurrency.isPending}
            type="submit"
          >
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
