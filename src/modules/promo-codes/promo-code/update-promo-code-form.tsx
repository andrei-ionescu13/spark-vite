import { Button } from '@/components/button';
import { FormInterval } from '@/components/form-interval';
import type { PromoCode } from '@/types/promo-code';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { PromoCodeFormCode } from '../components/promo-code-form-code';
import { PromoCodeFormCustomers } from '../components/promo-code-form-customers';
import { PromoCodeFormValue } from '../components/promo-code-form-value';
import { PromoCodeSummary } from '../components/promo-code-summary';
import { useUpdatePromoCode } from './api';

interface PromoCodeFormProps {
  promoCode: PromoCode;
  promoCodeIsRefetching?: boolean;
}

export const UpdatePromoCodeForm = ({ promoCode }: PromoCodeFormProps) => {
  const queryClient = useQueryClient();
  const [shouldSetEndDate, setShouldSetEndDate] = useState(
    !!promoCode?.endDate
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const updatePromoCode = useUpdatePromoCode(() =>
    queryClient.invalidateQueries({ queryKey: ['promo-code', promoCode?._id] })
  );

  const schema = z
    .object({
      shouldSetEndDate: z.boolean,
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

  type UpdatePromoCodeFormValues = z.infer<typeof schema>;

  const form = useForm<UpdatePromoCodeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      products: promoCode.products,
      users: promoCode.users,
      startDate: promoCode.startDate,
      type: promoCode.type,
      value: promoCode.value,
      code: promoCode.code,
      endDate: promoCode.endDate,
      productSelection: promoCode.productSelection,
      userSelection: promoCode.userSelection,
    },
  });

  const { handleSubmit, watch, setValue, formState, getValues } = form;
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const onShouldSetEndDateChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setShouldSetEndDate(event.target.checked);
  };

  const onSubmit: SubmitHandler<UpdatePromoCodeFormValues> = async (values) => {
    const formValues: Record<string, any> = { ...values };
    formValues.users =
      values.userSelection === 'selected'
        ? values.users.map((user) => user._id)
        : null;
    formValues.products =
      values.productSelection === 'selected'
        ? values.products.map((product) => product._id)
        : null;
    formValues.endDate = shouldSetEndDate ? values.endDate : null;

    updatePromoCode.mutate(
      { id: promoCode._id, body: formValues },
      {
        onSuccess: async (data) => {},
        onError: (error) => {
          setSubmitError(error.message);
        },
      }
    );
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
                isLoading={updatePromoCode.isPending}
                color="primary"
                fullWidth
                size="large"
                variant="contained"
                onClick={() => {}}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};
