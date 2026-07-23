import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import { appFetch } from '@/utils/app-fetch';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Card,
  Container,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router';
import * as z from 'zod';

const schema = z.object({
  username: z.string().min(5).max(255),
  password: z.string().min(5).max(255),
});

type FormData = z.infer<typeof schema>;

export const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async ({ username, password }) => {
    clearErrors('root.serverError');

    try {
      await appFetch({
        url: '/signup',
        config: {
          method: 'POST',
          body: JSON.stringify({
            username,
            password,
          }),
        },
      });

      navigate('/login');
    } catch (error: any) {
      setError('root.serverError', {
        type: 'server',
        message: error.message,
      });
    }
  };

  const handleShowPasswordChange = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <title>User Auth</title>
      <Box sx={{ width: '100%' }}>
        <Container maxWidth="sm">
          <Card
            sx={{
              mt: 20,
              px: 5,
              py: 3,
            }}
          >
            <Typography
              color="textPrimary"
              variant="h4"
              sx={{ mb: 5 }}
            >
              Signup
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid
                container
                spacing={3}
              >
                <Grid size={12}>
                  <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        label="Username"
                        autoComplete="username"
                        error={!!errors.username}
                        fullWidth
                        helperText={errors.username?.message}
                        id="username"
                      />
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        autoComplete="new-password"
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  color="secondary"
                                  onClick={handleShowPasswordChange}
                                >
                                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <Button
                    size="large"
                    fullWidth
                    color="primary"
                    variant="contained"
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Signup
                  </Button>
                </Grid>
              </Grid>
            </form>
            {!!errors.root?.serverError && (
              <FormHelperText
                error
                sx={{ mt: 1 }}
              >
                {errors.root.serverError.message}
              </FormHelperText>
            )}
          </Card>
        </Container>
      </Box>
    </>
  );
};
