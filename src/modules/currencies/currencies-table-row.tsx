import { AlertDialog } from '@/components/alert-dialog';
import { useDialog } from '@/hooks/useDialog';
import type { Currency } from '@/types/currencies';
import { IconButton, TableCell, TableRow } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import { useDeleteCurrency } from './api';

interface CurrenciesTableRowProps {
  currency: Currency;
}

export const CurrenciesTableRow = ({ currency }: CurrenciesTableRowProps) => {
  const queryClient = useQueryClient();
  const deleteLanguage = useDeleteCurrency(() =>
    queryClient.invalidateQueries({ queryKey: ['currencies'] })
  );
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();

  const handleDeleteLanguage = () => {
    deleteLanguage.mutate(currency._id, {
      onSuccess: () => {
        handleCloseDeleteDialog();
      },
    });
  };

  return (
    <>
      <TableRow key={currency._id}>
        <TableCell>{currency.name}</TableCell>
        <TableCell>{currency.code}</TableCell>
        <TableCell>{currency.symbol}</TableCell>
        <TableCell align="right">
          <IconButton
            color="error"
            onClick={handleOpenDeleteDialog}
          >
            <TrashIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title={`Delete ${currency.name} currency`}
        content="Are you sure you want to permanently delete this language?"
        onSubmit={handleDeleteLanguage}
        isLoading={deleteLanguage.isPending}
      />
    </>
  );
};
