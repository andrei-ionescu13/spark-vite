import { useDeleteReview, useUpdateReviewStatus } from '@/api';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Checkbox,
  colors,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Rating,
  TableCell,
  useTheme,
} from '@mui/material';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';
import { useDialog } from '../hooks/useDialog';
import type { Review } from '../types/review';
import { formatDate } from '../utils/format-date';
import type { ActionsItem } from './actions-menu';
import { AlertDialog } from './alert-dialog';
import { Button } from './button';
import { DataTableRow } from './data-table-row';
import { ActionsIconButton } from './icon-actions';
import { Label } from './label';
import { Link } from './link';
import { StatusSelect, type StatusOption } from './status';

interface StatusUpdateProps {
  open: boolean;
  onClose: () => void;
  review: Review;
  onSuccess: () => Promise<unknown>;
}

export const StatusUpdate = ({
  open,
  onClose,
  review,
  onSuccess,
}: StatusUpdateProps) => {
  const theme = useTheme();
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

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      status: review.status,
    },
  });

  const onSubmit: SubmitHandler<FormData> = ({ status }) =>
    updateReviewStatus.mutateAsync(status, {
      onSuccess: async () => {
        await onSuccess();
        onClose();
      },
      onError: (error) => {
        toast.error((error as Error).message);
      },
    });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Update status</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl
                error={!!errors.status}
                fullWidth
                size="small"
              >
                <StatusSelect
                  {...field}
                  id="status"
                  options={statusOptions}
                />
                {!!errors.status?.message && (
                  <FormHelperText>{errors.status.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={onClose}
            variant="text"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            isLoading={isSubmitting}
            variant="contained"
            type="submit"
          >
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

interface RaviewsTableRowProps {
  review: Review;
  onSelect: () => void;
  selected: boolean;
  showProduct?: boolean;
  showUser?: boolean;
  refetch: () => Promise<unknown>;
}

export const RaviewsTableRow = ({
  review,
  selected,
  onSelect,
  showProduct = true,
  showUser = true,
  refetch,
}: RaviewsTableRowProps) => {
  const theme = useTheme();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();
  const [updateDialogOpen, handleOpenUpdateDialog, handleCloseUpdateDialog] =
    useDialog();
  const deleteReview = useDeleteReview();

  const handleDeleteReview = () => {
    deleteReview.mutate(review._id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const actionItems: ActionsItem[] = [
    {
      label: 'Edit',
      icon: PencilIcon,
      onClick: handleOpenUpdateDialog,
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: 'error',
    },
  ];

  const mappedColors = {
    published: theme.palette.success.main,
    unpublished: colors.grey[500],
    flagged: theme.palette.error.main,
  };

  return (
    <>
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title="Delete review"
        content="Are you sure you want to delete this review?"
        onSubmit={handleDeleteReview}
        isLoading={deleteReview.isPending}
      />
      <StatusUpdate
        open={updateDialogOpen}
        onClose={handleCloseUpdateDialog}
        review={review}
        onSuccess={refetch}
      />
      <DataTableRow
        key={review._id}
        selected={selected}
      >
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            onChange={onSelect}
            checked={selected}
          />
        </TableCell>
        <TableCell>
          <Link
            color="textPrimary"
            variant="body1"
            underline="hover"
            to={`/reviews/${review._id}`}
          >
            {review._id}
          </Link>
        </TableCell>
        <TableCell>
          <Rating
            value={review.rating}
            readOnly
          />
        </TableCell>
        {showProduct && (
          <TableCell>
            <Link
              color="textPrimary"
              variant="body1"
              underline="hover"
              to={`/products/${review.product._id}`}
            >
              {review.product.title}
            </Link>
          </TableCell>
        )}
        {showUser && (
          <TableCell>
            <Link
              color="textPrimary"
              variant="body1"
              underline="hover"
              to={`/users/${review.user._id}`}
            >
              {review.user.email}
            </Link>
          </TableCell>
        )}
        <TableCell>{formatDate(review.createdAt)}</TableCell>
        <TableCell>
          <Label color={mappedColors[review.status]}>{review.status}</Label>
        </TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};
