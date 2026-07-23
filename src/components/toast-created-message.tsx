import { Box, Link, Typography } from '@mui/material';

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
        href={href}
        underline="hover"
        variant="body1"
      >
        {subheader}
      </Link>
    </Box>
  );
};
