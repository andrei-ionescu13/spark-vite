import { AlertDialog } from '@/components/alert-dialog';
import { TextInput } from '@/components/text-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { useCreateNamespace } from './api';

const schema = z.object({
  name: z.string(),
});

type FormData = z.infer<typeof schema>;

interface CreateNamespaceDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreateNamespaceDialog = ({
  open,
  onClose,
}: CreateNamespaceDialogProps) => {
  const queryClient = useQueryClient();
  const createNamespace = useCreateNamespace(() =>
    queryClient.invalidateQueries({ queryKey: ['namespaces'] })
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async ({ name }) => {
    createNamespace.mutate(name, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <AlertDialog
      open={open}
      onClose={onClose}
      fullWidth
      isLoading={createNamespace.isPending}
      title="Add namespace"
      onSubmit={handleSubmit(onSubmit)}
    >
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
                  label="Name"
                />
              );
            }}
          />
        </Grid>
      </Grid>
    </AlertDialog>
  );
};
