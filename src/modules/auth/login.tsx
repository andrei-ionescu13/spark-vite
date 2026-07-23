import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import { useAuth } from '@/contexts/auth-context';
import type { Admin } from '@/types/admin';
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

export const Login = () => {
  const navigate = useNavigate();
  const { setAdmin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: 'admin123',
      username: 'admin123',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async ({ username, password }) => {
    clearErrors('root.serverError');

    try {
      const admin = await appFetch<Admin>({
        url: '/login',
        config: {
          method: 'POST',
          body: JSON.stringify({
            username,
            password,
          }),
        },
      });

      setAdmin(admin);
      navigate('/');
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
    <Box
      sx={{
        display: 'flex',
        height: '100%',
      }}
    >
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
              Login
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
                    render={({ field }) => {
                      return (
                        <TextInput
                          {...field}
                          autoComplete="username"
                          error={!!errors.username}
                          helperText={errors.username?.message}
                          fullWidth
                          id="username"
                          label="Username"
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid size={12}>
                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        autoComplete="current-password"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        fullWidth
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        variant="outlined"
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
                    Login
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
    </Box>
  );
};
