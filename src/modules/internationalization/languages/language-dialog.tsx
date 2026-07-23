import { Button } from '@/components/button';
import type { Language } from '@/types/translations';
import { appFetch } from '@/utils/app-fetch';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Autocomplete,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  TextField,
} from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, type SyntheticEvent } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { useCreateTranslationsLanguage } from './api';

const schema = z.object({
  language: z.object({
    code: z.string(),
    name: z.string(),
    nativeName: z.string(),
    _id: z.string(),
  }) satisfies z.ZodType<Language>,
});

type FormData = z.infer<typeof schema>;

const listLanguages =
  (config: Record<string, any> = {}) =>
  () =>
    appFetch<Language[]>({
      url: '/languages',
      withAuth: true,
      ...config,
    });

const listTranslationsLanguages =
  (config: Record<string, any> = {}) =>
  () =>
    appFetch<Language[]>({
      url: '/translations/languages',
      withAuth: true,
      ...config,
    });

interface LanguageTagDialogProps {
  open: boolean;
  onClose: any;
}

export const LanguageDialog = ({ open, onClose }: LanguageTagDialogProps) => {
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);

  const { data: translationsLanguages } = useQuery({
    queryKey: ['translations-languages'],
    queryFn: listTranslationsLanguages(),
  });
  const { data: languages, isFetching } = useQuery({
    queryKey: ['languages'],
    queryFn: listLanguages(),
    enabled: autocompleteOpen,
    gcTime: 0,
  });

  const languageCodes = (translationsLanguages || []).map(
    (language) => language.code
  );
  const queryClient = useQueryClient();
  const createTranslationsLanguage = useCreateTranslationsLanguage(() =>
    queryClient.invalidateQueries({ queryKey: ['translations-languages'] })
  );

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    clearErrors('root.serverError');
    createTranslationsLanguage.mutate(
      { ...values.language },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          setError('root.serverError', {
            type: 'server',
            message: error.message,
          });
        },
      }
    );
  };

  const filteredLanguageOptions = (languages || []).filter(
    (option) => !languageCodes.includes(option.code)
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Add language</DialogTitle>
        <DialogContent sx={{ py: '24px !important' }}>
          <Grid
            container
            spacing={2}
          >
            <Grid size={12}>
              <Controller
                name="language"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => {
                  return (
                    <Autocomplete
                      open={autocompleteOpen}
                      onOpen={() => {
                        setAutocompleteOpen(true);
                      }}
                      onClose={() => {
                        setAutocompleteOpen(false);
                      }}
                      getOptionLabel={(option) => option.name}
                      options={filteredLanguageOptions}
                      loading={isFetching}
                      filterSelectedOptions
                      id="code"
                      onChange={(event: SyntheticEvent, newValue) => {
                        onChange(newValue);
                      }}
                      value={filteredLanguageOptions.find(
                        (option) => option.code === value?.code
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...rest}
                          label="Language"
                          error={!!errors.language}
                          helperText={errors.language?.message}
                          slotProps={{
                            ...params.slotProps,
                            input: {
                              ...params.slotProps.input,
                              endAdornment: (
                                <React.Fragment>
                                  {isFetching ? (
                                    <CircularProgress
                                      color="inherit"
                                      size={20}
                                    />
                                  ) : null}
                                  {params.slotProps.input.endAdornment}
                                </React.Fragment>
                              ),
                            },
                          }}
                        />
                      )}
                    />
                  );
                }}
              />
            </Grid>
            {!!errors.root?.serverError && (
              <Grid size={12}>
                <FormHelperText error>
                  {errors.root.serverError.message}
                </FormHelperText>
              </Grid>
            )}
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
            isLoading={createTranslationsLanguage.isPending}
            type="submit"
          >
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
