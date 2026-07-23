import { useAuth } from '@/contexts/auth-context';
import { appFetch } from '@/utils/app-fetch';
import { useNavigate } from 'react-router';
import { Button } from '../components/button';

export const NavbarLogoutButton = () => {
  const navigate = useNavigate();
  const { clearAdmin } = useAuth();

  const handleClick = async () => {
    try {
      await appFetch({ url: '/logout' });
      clearAdmin();
      navigate('/login');
    } catch (error) {}
  };

  return (
    <Button
      color="secondary"
      variant="text"
      onClick={handleClick}
    >
      Logout
    </Button>
  );
};
