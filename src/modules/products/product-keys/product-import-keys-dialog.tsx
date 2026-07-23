import { AlertDialog } from '@/components/alert-dialog';
import { buildFormData } from '@/utils/build-form-data';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, FormHelperText, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import type { ChangeEvent } from 'react';
import { useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router';
import * as z from 'zod';
import { useImportProductKeys } from './api';

const schema = z.object({
  keys: z.file(),
});

type FormData = z.infer<typeof schema>;

interface ProductImportKeysDialogProps {
  open: boolean;
  onClose: any;
}

export const ProductImportKeysDialog = ({
  open,
  onClose,
}: ProductImportKeysDialogProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const importProductKeys = useImportProductKeys(() =>
    queryClient.invalidateQueries({ queryKey: ['product-keys', id] })
  );

  const { handleSubmit, setError, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const keys = watch('keys');

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    const formData = buildFormData(values);
    importProductKeys.mutate(
      { id, formData },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0] && !event.target.files?.[0]) {
      return;
    }

    if (event.target.files[0]?.type !== 'text/plain') {
      setError('keys', { message: 'the file should be a text file' });
      return;
    }

    setValue('keys', event.target.files[0]);
  };

  return (
    <AlertDialog
      open={open}
      onClose={onClose}
      title="Import keys"
      onSubmit={handleSubmit(onSubmit)}
      isLoading={importProductKeys.isPending}
      maxWidth="sm"
      fullWidth
    >
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          gap: 2,
          input: {
            display: 'none',
          },
        }}
      >
        <Typography
          color="textSecondary"
          variant="body1"
        >
          Please import a file
        </Typography>
        <input
          type="file"
          name="keys"
          onChange={handleSelectFile}
          ref={inputRef}
        />
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            inputRef.current?.click();
          }}
        >
          Import
        </Button>
        {!!keys && (
          <Typography
            color="textPrimary"
            variant="body2"
          >
            {keys.name}
            <br />
            <Typography
              color="textPrimary"
              variant="subtitle1"
              component="span"
            >
              Loaded
            </Typography>
          </Typography>
        )}
        {importProductKeys.isError && (
          <FormHelperText
            error
            sx={{ mt: 1 }}
          >
            {importProductKeys.error.message}
          </FormHelperText>
        )}
      </Box>
    </AlertDialog>
  );
};
