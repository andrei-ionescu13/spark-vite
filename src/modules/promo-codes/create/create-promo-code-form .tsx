import { Button } from '@/components/button';
import { FormInterval } from '@/components/form-interval';
import { ToastItemCreated } from '@/components/toast-item-created';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid } from '@mui/material';
import type { ChangeEvent } from 'react';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';
import { PromoCodeFormCode } from '../components/promo-code-form-code';
import { PromoCodeFormCustomers } from '../components/promo-code-form-customers';
import { PromoCodeFormValue } from '../components/promo-code-form-value';
import { PromoCodeSummary } from '../components/promo-code-summary';
import { useCreatePromoCode } from './api';

const schema = z
  .object({
    shouldSetEndDate: z.boolean(),
    startDate: z.iso.datetime(),
    endDate: z.iso.datetime().optional().nullable(),
    type: z.enum(['percentage', 'amount']),
    productSelection: z.enum(['general', 'selected']),
    userSelection: z.enum(['general', 'selected']),
    value: z.number(),
    code: z.string(),
    products: z.array(z.any()),
    users: z.array(z.any()),
  })
  .superRefine((data, ctx) => {
    if (data.productSelection === 'selected' && data.products.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['products'],
        message: 'Select at least one product.',
      });
    }

    if (data.userSelection === 'selected' && data.users.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['users'],
        message: 'Select at least one user.',
      });
    }
  });

export type PromoCodeFormValues = z.infer<typeof schema>;

export const CreatePromoCodeForm = () => {
  const createPromoCode = useCreatePromoCode();

  const form = useForm<PromoCodeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      shouldSetEndDate: false,
      products: [],
      users: [],
      startDate: undefined,
      type: 'amount',
      value: undefined,
      code: '',
      endDate: undefined,
      productSelection: 'selected',
      userSelection: 'selected',
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState,
    getValues,
    reset,
    setError,
    clearErrors,
  } = form;
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const shouldSetEndDate = watch('shouldSetEndDate');

  const onSubmit: SubmitHandler<PromoCodeFormValues> = async (values) => {
    clearErrors('root.serverError');
    const formValues: Record<string, any> = { ...values };
    formValues.users =
      values.userSelection === 'selected'
        ? values.users.map((user) => user._id)
        : null;
    formValues.products =
      values.productSelection === 'selected'
        ? values.products.map((product) => product._id)
        : null;
    formValues.endDate = values.shouldSetEndDate ? values.endDate : null;

    createPromoCode.mutate(formValues, {
      onSuccess: (promoCode) => {
        reset();
        toast.success(
          ToastItemCreated('promo code', `/promo-codes/${promoCode._id}`)
        );
      },
      onError: (error) => {
        setError('root.serverError', {
          type: 'server',
          message: error.message,
        });
      },
    });
  };

  const onShouldSetEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue('shouldSetEndDate', event.target.checked);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            size={8}
            container
            spacing={3}
          >
            <Grid size={12}>
              <PromoCodeFormCode />
            </Grid>
            <Grid size={12}>
              <PromoCodeFormValue />
            </Grid>
            <Grid size={12}>
              <PromoCodeFormCustomers />
            </Grid>
            <Grid size={12}>
              <FormInterval
                onShouldSetEndDateChange={onShouldSetEndDateChange}
                shouldSetEndDate={shouldSetEndDate}
                startDate={{
                  value: startDate,
                  onChange: (value: string) => setValue('startDate', value),
                  error: formState.errors.startDate?.message,
                }}
                endDate={{
                  value: endDate,
                  onChange: (value: string) => setValue('endDate', value),
                  error: formState.errors.endDate?.message,
                }}
              />
            </Grid>
          </Grid>
          <Grid
            size={4}
            container
            sx={{ height: 'fit-content' }}
            spacing={3}
          >
            <Grid size={12}>
              <PromoCodeSummary
                {...getValues()}
                endDate={shouldSetEndDate ? endDate : undefined}
              />
            </Grid>
            <Grid size={12}>
              <Button
                isLoading={createPromoCode.isPending}
                color="primary"
                fullWidth
                size="large"
                variant="contained"
                type="submit"
              >
                Create
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};
