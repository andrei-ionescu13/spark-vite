import { AlertDialog } from '@/components/alert-dialog';
import { TextInput } from '@/components/text-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { useUpdateNamespaceName } from './api';

const schema = z.object({
  name: z.string(),
});

type FormData = z.infer<typeof schema>;

interface UpdateNamespaceDialogProps {
  namespace: any;
  open: boolean;
  onClose: () => void;
}

export const UpdateNamespaceDialog = ({
  namespace,
  open,
  onClose,
}: UpdateNamespaceDialogProps) => {
  const queryClient = useQueryClient();
  const updateNamespaceName = useUpdateNamespaceName(() =>
    queryClient.invalidateQueries({ queryKey: ['namespaces'] })
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: namespace.name,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async ({ name }) => {
    updateNamespaceName.mutate(
      { id: namespace?._id, name },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <AlertDialog
      open={open}
      onClose={onClose}
      fullWidth
      isLoading={updateNamespaceName.isPending}
      title="Update namespace"
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
