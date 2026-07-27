import { Link } from '@/components/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, FormHelperText, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import type { ChangeEvent } from 'react';
import { useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { AlertDialog } from '../../components/alert-dialog';
import { Button } from '../../components/button';
import { buildFormData } from '../../utils/build-form-data';
import { useImportKeys } from '../products/api';

const schema = z.object({
  keys: z.file(),
});

type FormData = z.infer<typeof schema>;

interface KeysImportDialogProps {
  open: boolean;
  onClose: () => void;
}

export const KeysImportDialog = ({ open, onClose }: KeysImportDialogProps) => {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const importKeys = useImportKeys();

  const { handleSubmit, setError, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      keys: undefined,
    },
  });
  const keys = watch('keys');

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    const formData = buildFormData(values);

    importKeys.mutate(formData, {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries({ queryKey: ['keys'] });
      },
    });
  };

  const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0] && !event.target.files?.[0]) {
      return;
    }

    if (event.target.files[0]?.type !== 'application/json') {
      setError('keys', { message: 'the file should be a json file' });
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
      isLoading={importKeys.isPending}
      maxWidth="sm"
      fullWidth
      sx={{
        input: {
          display: 'none',
        },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          gap: 1,
        }}
      >
        <Typography
          color="textPrimary"
          variant="body1"
        >
          Please import a file (
          <Link
            color="textSecondary"
            variant="body1"
            to="https://res.cloudinary.com/desubtoqp/image/upload/v1655918415/products/Untitled_arihfo.png"
            target="_blank"
          >
            check format
          </Link>
          )
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
        {importKeys.isError && (
          <FormHelperText
            error
            sx={{ mt: 1 }}
          >
            {importKeys.error.message}
          </FormHelperText>
        )}
      </Box>
    </AlertDialog>
  );
};
