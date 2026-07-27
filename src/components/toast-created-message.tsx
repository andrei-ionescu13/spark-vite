import { Box, Typography } from '@mui/material';
import { Link } from './link';

interface ToastCreatedMessageProps {
  title: string;
  subheader: string;
  href: string;
}

export const ToastCreatedMessage = ({
  title,
  subheader,
  href,
}: ToastCreatedMessageProps) => {
  return (
    <Box>
      <Typography
        variant="body1"
        color="textPrimary"
      >
        {title}
      </Typography>
      <Link
        color="textSecondary"
        to={href}
        underline="hover"
        variant="body1"
      >
        {subheader}
      </Link>
    </Box>
  );
};
