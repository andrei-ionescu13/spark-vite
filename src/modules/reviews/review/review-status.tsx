import { useUpdateReviewStatus } from '@/api';
import { Button } from '@/components/button';
import { StatusSelect, type StatusOption } from '@/components/status';
import type { Review } from '@/types/review';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  colors,
  Divider,
  FormControl,
  useTheme,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';

interface ReviewStatusProps {
  review: Review;
}

export const ReviewStatus = ({ review }: ReviewStatusProps) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const updateReviewStatus = useUpdateReviewStatus(review._id);

  const statusOptions: StatusOption[] = [
    {
      label: 'Published',
      value: 'published',
      color: theme.palette.success.main,
    },
    {
      label: 'Unpublished',
      value: 'unpublished',
      color: colors.grey[500],
    },
    {
      label: 'Flagged',
      value: 'flagged',
      color: theme.palette.error.main,
    },
  ];

  const schema = z.object({
    status: z.enum(statusOptions.map((status) => status.value)),
  });

  type FormData = z.infer<typeof schema>;

  const { handleSubmit, control, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      status: review.status,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async ({ status }) => {
    updateReviewStatus.mutate(status, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['reviews', review._id] });
        toast.success('Review updated');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const isDisabled = review.status === watch('status');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader title="Status" />
        <Divider />
        <CardContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '9fr 3fr',
              gap: 1,
            }}
          >
            <Controller
              name="status"
              control={control}
              render={({ field }) => {
                return (
                  <FormControl
                    fullWidth
                    size="small"
                  >
                    <StatusSelect
                      {...field}
                      id="status"
                      options={statusOptions}
                    />
                  </FormControl>
                );
              }}
            />
            <Button
              fullWidth
              color="primary"
              variant="contained"
              isLoading={updateReviewStatus.isPending}
              disabled={isDisabled}
              type="submit"
            >
              Update
            </Button>
          </Box>
        </CardContent>
      </Card>
    </form>
  );
};
