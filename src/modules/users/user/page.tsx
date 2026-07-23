import { Grid } from '@mui/material';
import { useParams } from 'react-router';
import { useGetUser } from '../api';
import { UserDetails } from './user-general-details';

export const User = () => {
  const { id } = useParams<{ id: string }>();
  const { data: user } = useGetUser(id);

  return (
    <>
      <title>User</title>
      {!!user && (
        <Grid
          container
          spacing={2}
        >
          <Grid
            size={{
              xs: 12,
              md: 8,
            }}
          >
            <UserDetails user={user} />
          </Grid>
          {/* <Grid
            item
            xs={12}
            md={5}
          >
            <UserGeneralOrders orders={orders} />
          </Grid> */}
        </Grid>
      )}
    </>
  );
};
