import { Button } from '@/components/button';
import { ImageDropzone } from '@/components/image-dropzone';
import { TextInput } from '@/components/text-input';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { buildFormData } from '../../utils/build-form-data';
import { useCreatePlatform } from './api';

const schema = z.object({
  name: z.string().max(255),
  logo: z.file(),
});

type FormData = z.infer<typeof schema>;

interface CreatePlatformDialogProps {
  open: boolean;
  onClose: any;
}

export const CreatePlatformDialog = ({
  open,
  onClose,
}: CreatePlatformDialogProps) => {
  const queryClient = useQueryClient();
  const createPlatform = useCreatePlatform(() =>
    queryClient.invalidateQueries({ queryKey: ['platforms'] })
  );

  const handleCreatePlatform = (formData: any) => {
    createPlatform.mutate(formData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = (values) => {
    const formData = buildFormData(values);
    handleCreatePlatform(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Add platform</DialogTitle>
        <DialogContent sx={{ py: '24px !important' }}>
          <Grid
            container
            spacing={2}
          >
            <Grid size={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => {
                  return (
                    <TextInput
                      {...field}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      fullWidth
                      id="name"
                      label="Publisher"
                      size="small"
                    />
                  );
                }}
              />
            </Grid>
            <Grid size={12}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Logo
              </Typography>
              <Controller
                name="logo"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <ImageDropzone
                      file={value}
                      onDrop={(file: any) => {
                        onChange(file);
                      }}
                      onError={(error: string) => {
                        setError('logo', { message: error });
                      }}
                    />
                  );
                }}
              />
              {!!errors.logo && (
                <FormHelperText error>{errors.logo.message}</FormHelperText>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            color="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            isLoading={createPlatform.isPending}
            type="submit"
          >
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
