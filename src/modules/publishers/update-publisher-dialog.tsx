import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import type { Publisher } from '@/types/publishers';
import { isString } from '@/utils/is-string';
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
import { ImageUpdate } from '../../components/image-update';
import { buildFormData } from '../../utils/build-form-data';
import { useUpdatePublisher } from './api';

const schema = z.object({
  name: z.string().max(255),
  slug: z.string().max(255),
  logo: z.union([z.file(), z.string()]),
});

type FormData = z.infer<typeof schema>;

interface UpdatePublisherDialogProps {
  open: boolean;
  onClose: any;
  publisher: Publisher;
}

export const UpdatePublisherDialog = ({
  open,
  onClose,
  publisher,
}: UpdatePublisherDialogProps) => {
  const queryClient = useQueryClient();

  const updatePublisher = useUpdatePublisher(() =>
    queryClient.invalidateQueries({ queryKey: ['publishers'] })
  );

  const handleUpdatePublisher = (formData: any) => {
    updatePublisher.mutate(
      { id: publisher._id, body: formData },
      {
        onSuccess: onClose,
      }
    );
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: publisher.name,
      slug: publisher.slug,
      logo: publisher.logo.url,
    },
  });

  const onSubmit: SubmitHandler<FormData> = (values) => {
    const formData = buildFormData(values);
    handleUpdatePublisher(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Update publisher</DialogTitle>
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
              <Controller
                name="slug"
                control={control}
                render={({ field }) => {
                  return (
                    <TextInput
                      {...field}
                      error={!!errors.slug}
                      helperText={errors.slug?.message}
                      fullWidth
                      id="slug"
                      label="Slug"
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
                render={({ field: { value, onChange, name } }) => {
                  return (
                    <ImageUpdate
                      name={name}
                      url={isString(value) ? value : ''}
                      alt=""
                      onFileSelect={(file: any) => {
                        onChange(file);
                      }}
                    />
                  );
                }}
              />

              {!!errors.logo?.message && (
                <FormHelperText error>{errors.logo?.message}</FormHelperText>
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
            isLoading={updatePublisher.isPending}
            type="submit"
          >
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
