import { Navigate, Outlet } from 'react-router';
import { useAuth } from './contexts/auth-context';

export const AuthLayout = () => {
  const { admin } = useAuth();

  if (admin) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
};
