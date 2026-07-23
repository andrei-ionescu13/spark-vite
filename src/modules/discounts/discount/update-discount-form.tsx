import { Button } from '@/components/button';
import { FormInterval } from '@/components/form-interval';
import { TextInput } from '@/components/text-input';
import type { Discount } from '@/types/discounts';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, FormHelperText, Grid, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import {
  Controller,
  FormProvider,
  useForm,
  type SubmitHandler,
} from 'react-hook-form';
import * as z from 'zod';
import { DiscountFormValue } from '../components/discount-form-value';
import { DiscountSummary } from '../components/discount-summary';
import { useUpdateDiscount } from './api';

interface UpdateDiscountFormProps {
  discount: Discount;
}

export const UpdateDiscountForm = ({ discount }: UpdateDiscountFormProps) => {
  const queryClient = useQueryClient();
  const updateDiscount = useUpdateDiscount(() =>
    queryClient.invalidateQueries({ queryKey: ['discount', discount._id] })
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schema = z
    .object({
      products: z
        .array(z.object({ title: z.string(), _id: z.string() }))
        .min(1),
      startDate: z.iso.datetime(),
      type: z.enum(['percentage', 'amount']),
      value: z.number().positive(),
      title: z.string(),
      endDate: z.iso.datetime().optional(),
      shouldSetEndDate: z.boolean(),
    })
    .refine((data) => !data.shouldSetEndDate || !!data.endDate, {
      message: 'End Date required',
      path: ['endDate'],
    });

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      products: discount.products,
      startDate: discount.startDate,
      type: discount.type,
      value: discount.value,
      title: discount.title,
      endDate: discount.endDate,
    },
  });
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    getValues,
    control,
  } = form;
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const shouldSetEndDate = watch('shouldSetEndDate');

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const formValues: Record<string, any> = { ...values };
    formValues.products = values.products.map((product) => product?._id);
    formValues.endDate = values.shouldSetEndDate ? values.endDate : null;

    setSubmitError(null);

    updateDiscount.mutate(
      { id: discount._id, body: formValues },
      {
        onSuccess: async () => {
          queryClient.invalidateQueries({
            queryKey: ['discount', discount._id],
          });
        },
        onError: (error) => {
          setSubmitError(error.message);
        },
      }
    );
  };

  const onShouldSetEndDateChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
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
                      Discount title
                    </Typography>
                  </Grid>
                  <Grid size={12}>
                    <Controller
                      control={control}
                      name="title"
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          error={!!errors.title}
                          helperText={errors.title?.message}
                          fullWidth
                          id="title"
                          label="Discount title"
                          name="title"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid size={12}>
              <DiscountFormValue />
            </Grid>
            <Grid size={12}>
              <FormInterval
                onShouldSetEndDateChange={onShouldSetEndDateChange}
                shouldSetEndDate={shouldSetEndDate}
                startDate={{
                  value: startDate,
                  onChange: (value: string) => setValue('startDate', value),
                  error: errors.startDate?.message,
                }}
                endDate={{
                  value: endDate,
                  onChange: (value: string) => setValue('endDate', value),
                  error: errors.endDate?.message,
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
              <DiscountSummary
                {...getValues()}
                endDate={shouldSetEndDate ? endDate : undefined}
              />
            </Grid>
            <Grid size={12}>
              <Button
                color="primary"
                fullWidth
                size="large"
                variant="contained"
                isLoading={updateDiscount.isPending}
                type="submit"
              >
                Update
              </Button>
            </Grid>
            {!!submitError && (
              <Grid size={12}>
                <FormHelperText error>{submitError}</FormHelperText>
              </Grid>
            )}
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};
