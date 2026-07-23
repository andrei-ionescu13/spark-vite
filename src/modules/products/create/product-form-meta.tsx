import { zodResolver } from '@hookform/resolvers/zod';
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
} from '@mui/material';
import type { SyntheticEvent } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../../../components/button';
import { TextInput } from '../../../components/text-input';

const schema = z.object({
  metaDescription: z.string().max(512, 'Must be 512 characters or less'),
  metaKeywords: z.array(z.string()).min(1),
  metaTitle: z.string().max(100),
});

type FormData = z.infer<typeof schema>;

const metaKeywordOptions = ['Games', 'News', 'Review'];

interface ProductFormMetaProps {
  onNext: any;
  onBack: any;
}

export const ProductFormMeta = ({ onBack, onNext }: ProductFormMetaProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      metaDescription: '',
      metaKeywords: [],
      metaTitle: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    onNext(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Card>
          <CardContent>
            <Grid
              container
              spacing={2}
            >
              <Grid size={12}>
                <Controller
                  name="metaTitle"
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextInput
                        {...field}
                        error={!!errors.metaTitle}
                        helperText={errors.metaTitle?.message}
                        fullWidth
                        id="metaTitle"
                        label="Title"
                      />
                    );
                  }}
                />
              </Grid>
              <Grid size={12}>
                <Controller
                  name="metaDescription"
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextInput
                        {...field}
                        error={!!errors.metaDescription}
                        helperText={errors.metaDescription?.message}
                        fullWidth
                        id="metaDescription"
                        label="Description"
                        minRows={4}
                        multiline
                      />
                    );
                  }}
                />
              </Grid>
              <Grid size={12}>
                <Controller
                  name="metaKeywords"
                  control={control}
                  render={({ field: { value, onChange, ...rest } }) => {
                    return (
                      <Autocomplete
                        options={metaKeywordOptions}
                        filterSelectedOptions
                        freeSolo
                        multiple
                        onChange={(event: SyntheticEvent, newValue) => {
                          onChange(newValue);
                        }}
                        value={value}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            {...rest}
                            label="Keywords"
                            error={!!errors.metaKeywords}
                            helperText={errors.metaKeywords?.message}
                          />
                        )}
                      />
                    );
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            color="inherit"
            onClick={onBack}
            size="large"
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Button
            size="large"
            type="submit"
          >
            Next
          </Button>
        </Box>
      </Box>
    </form>
  );
};
