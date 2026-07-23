import { AddUsersDialog } from '@/components/add-users-dialog';
import { Button } from '@/components/button';
import { useDialog } from '@/hooks/useDialog';
import type { User } from '@/types/user';
import {
  Card,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { TrashIcon } from 'lucide-react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import type { PromoCodeFormValues } from '../create/create-promo-code-form ';

export const PromoCodeFormCustomers = () => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PromoCodeFormValues>();
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const users = useWatch({ control, name: 'users' });
  const userSelection = useWatch({ control, name: 'userSelection' });

  return (
    <>
      {dialogOpen && (
        <AddUsersDialog
          open
          onClose={() => {
            handleCloseDialog();
          }}
          onAdd={(users: User[]) => {
            setValue('users', users);
          }}
          selectedUsers={users}
        />
      )}
      <Card sx={{ p: 2 }}>
        <Grid
          container
          spacing={2}
        >
          <Grid size={12}>
            <Typography
              color="textPrimary"
              variant="subtitle1"
            >
              Customer eligibility
            </Typography>
          </Grid>
          <Grid size={12}>
            <Controller
              control={control}
              name="userSelection"
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel
                    value="general"
                    control={<Radio />}
                    label="General"
                  />
                  <FormControlLabel
                    value="selected"
                    control={<Radio />}
                    label="Selected customers"
                  />
                </RadioGroup>
              )}
            />
          </Grid>
          <Grid size={12}>
            <Button
              disabled={userSelection !== 'selected'}
              onClick={handleOpenDialog}
              color="primary"
              variant="contained"
            >
              Browse
            </Button>
          </Grid>
          {!!errors.users && (
            <Grid size={12}>
              <FormHelperText error>{errors.users.message}</FormHelperText>
            </Grid>
          )}
          {userSelection === 'selected' && !!users.length && (
            <Grid size={12}>
              <List disablePadding>
                {users.map((user) => (
                  <ListItem
                    key={user._id}
                    disableGutters
                    divider
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Link
                      color="textPrimary"
                      variant="body1"
                      underline="hover"
                      href={`/users/${user._id}`}
                    >
                      {user.email}
                    </Link>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setValue(
                          'users',
                          users.filter((_user) => _user._id !== user._id)
                        );
                      }}
                    >
                      <TrashIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}
        </Grid>
      </Card>
    </>
  );
};
