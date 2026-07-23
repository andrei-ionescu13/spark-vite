import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Card,
  CardContent,
  FormHelperText,
  Typography,
} from '@mui/material';
import type { ChangeEvent } from 'react';
import { useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../../../components/button';

const schema = z.object({
  keys: z.file(),
});

type FormData = z.infer<typeof schema>;

interface ProductFormKeysProps {
  onSubmit: any;
  onBack: any;
  isLoading: boolean;
}

export const ProductFormKeys = ({
  onBack,
  onSubmit: onSubmitProp,
  isLoading,
}: ProductFormKeysProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const keys = watch('keys');

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    onSubmitProp(values);
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Card>
          <CardContent
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
            {errors.keys && (
              <FormHelperText error>{errors.keys.message}</FormHelperText>
            )}
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
            variant="contained"
            isLoading={isLoading}
            type="subtitle1"
          >
            Submit
          </Button>
        </Box>
      </Box>
    </form>
  );
};
