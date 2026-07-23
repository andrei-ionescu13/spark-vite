import type { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import { Label } from '@/components/label';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import type { PromoCode } from '@/types/promo-code';
import { getStatusFromInterval } from '@/utils/get-status-from-interval';
import { colors, Skeleton, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { EyeOffIcon, TrashIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useDeactivatePromoCode, useDeletePromoCode } from '../api';

interface PromoCodeHeaderProps {
  promoCode?: PromoCode;
  isLoading: boolean;
}

export const PromoCodeHeader = ({
  promoCode,
  isLoading,
}: PromoCodeHeaderProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog(false);
  const [
    deactivateDialogOpen,
    handleOpenDeactivateDialog,
    handleCloseDeactivateDialog,
  ] = useDialog(false);
  const deletePromoCode = useDeletePromoCode();
  const deactivatePromoCode = useDeactivatePromoCode(() =>
    queryClient.invalidateQueries({ queryKey: ['promo-code', id] })
  );

  const status =
    promoCode && getStatusFromInterval(promoCode.startDate, promoCode.endDate);

  const mappedColors = {
    scheduled: colors.grey[500],
    active: theme.palette.success.main,
    expired: theme.palette.error.main,
  };

  const actionItems: ActionsItem[] = [
    {
      label: 'Deactivate',
      icon: EyeOffIcon,
      onClick: handleOpenDeactivateDialog,
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: 'error',
    },
  ];

  const handleDeletePromoCode = (promoCode: PromoCode): void => {
    deletePromoCode.mutate(promoCode._id, {
      onSuccess: () => {
        navigate('/promo-codes');
      },
    });
  };

  const handleDeactivatePromoCode = (promoCode: PromoCode): void => {
    deactivatePromoCode.mutate(promoCode._id, {
      onSuccess: () => {
        handleCloseDeactivateDialog();
      },
    });
  };

  return (
    <>
      <PageHeader
        actions={actionItems}
        backHref="/promo-codes"
        backLabel="Promo codes"
        title={promoCode && `Promo code ${promoCode.code}`}
        isLoading={isLoading}
      >
        {status && <Label color={mappedColors[status]}>{status}</Label>}
        {isLoading && (
          <Skeleton
            variant="rounded"
            width={80}
            height={21}
          />
        )}
      </PageHeader>
      {!!promoCode && (
        <>
          <AlertDialog
            open={deleteDialogOpen}
            onClose={handleCloseDeleteDialog}
            title={`Delete promoCode`}
            content="Are you sure you want to delete this promoCode?"
            onSubmit={() => {
              handleDeletePromoCode(promoCode);
            }}
            isLoading={deletePromoCode.isPending}
          />
          <AlertDialog
            open={deactivateDialogOpen}
            onClose={handleCloseDeactivateDialog}
            title={`Deactivate promoCode`}
            content="Are you sure you want to deactivate this promoCode?"
            onSubmit={() => {
              handleDeactivatePromoCode(promoCode);
            }}
            isLoading={deactivatePromoCode.isPending}
          />
        </>
      )}
    </>
  );
};
