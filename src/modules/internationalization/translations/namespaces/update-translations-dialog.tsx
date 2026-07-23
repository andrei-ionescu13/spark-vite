import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import type { Language, Translation } from '@/types/translations';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { useUpdateNamespaceTranslation } from './api';

interface UpdateTranslationsDialogProps {
  open: boolean;
  onClose: () => void;
  translation: Translation;
  namespaceId: string;
  languages: Language[];
}

export const UpdateTranslationsDialog = ({
  open,
  onClose,
  translation,
  namespaceId,
  languages,
}: UpdateTranslationsDialogProps) => {
  const queryClient = useQueryClient();
  const updateNamespaceTranslation = useUpdateNamespaceTranslation(() =>
    queryClient.invalidateQueries({ queryKey: ['namespaces'] })
  );

  const languageCodes = languages.map((language) => language.code);
  const languagesSchema: Record<string, z.ZodString> = {};

  languageCodes.forEach((code) => {
    languagesSchema[code] = z.string();
  });

  const schema = z.object({
    key: z.string(),
    ...languagesSchema,
  });

  type FormData = {
    key: string;
  } & Record<string, string>;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: languages.reduce(
      (acc, { code }) => {
        return {
          ...acc,
          [code]: translation?.[code as keyof Translation] || '',
        };
      },
      { key: translation?.key || '' }
    ),
  });

  const onSubmit: SubmitHandler<FormData> = (values) => {
    const { key, ...formBody } = values;
    updateNamespaceTranslation.mutate(
      { id: namespaceId, translationKey: translation?.key, body: formBody },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Update translations</DialogTitle>
        <DialogContent sx={{ py: '24px !important' }}>
          <Grid
            container
            spacing={2}
          >
            <Grid size={12}>
              <Controller
                name="key"
                control={control}
                render={({ field }) => {
                  return (
                    <TextInput
                      {...field}
                      error={!!errors.key}
                      helperText={errors.key?.message}
                      fullWidth
                      id="key"
                      label="Key"
                    />
                  );
                }}
              />
            </Grid>
            {languages.map((option) => (
              <Grid
                size={12}
                key={option.code}
              >
                <Controller
                  name={option.code}
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextInput
                        {...field}
                        error={!!errors[option.code]}
                        fullWidth
                        helperText={errors[option.code]?.message}
                        label={option.name}
                        name={option.code}
                        size="small"
                      />
                    );
                  }}
                />
              </Grid>
            ))}
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
            variant="contained"
            color="primary"
            isLoading={updateNamespaceTranslation.isPending}
            type="submit"
          >
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
