import { useDeleteReview } from '@/api';
import { AlertDialog } from '@/components/alert-dialog';
import { Label } from '@/components/label';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import type { Review } from '@/types/review';
import { colors, Skeleton, useTheme } from '@mui/material';
import { TrashIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

interface ReviewHeaderProps {
  review?: Review;
  isLoading: boolean;
}

interface Status {
  label: string;
  value: string;
}

export const ReviewHeader = ({ review, isLoading }: ReviewHeaderProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();
  const deleteReview = useDeleteReview();

  const handleDeleteReview = (review: Review): void => {
    deleteReview.mutate(review._id, {
      onSuccess: () => {
        navigate('/reviews');
      },
    });
  };

  const mappedColors: Record<Status['value'], string> = {
    unpublished: colors.grey[500],
    published: theme.palette.success.main,
    flagged: theme.palette.error.main,
  };

  return (
    <>
      <PageHeader
        backHref="/reviews"
        backLabel="Reviews"
        title={'Review'}
        action={{
          icon: TrashIcon,
          color: 'error',
          label: 'Delete',
          onClick: handleOpenDeleteDialog,
        }}
      >
        {review && (
          <Label color={mappedColors[review.status]}>{review.status}</Label>
        )}
        {isLoading && (
          <Skeleton
            variant="rounded"
            width={80}
            height={21}
          />
        )}
      </PageHeader>
      {!!review && (
        <AlertDialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          title="Delete review"
          content="Are you sure you want to delete this review?"
          onSubmit={() => {
            handleDeleteReview(review);
          }}
          isLoading={deleteReview.isPending}
        />
      )}
    </>
  );
};
