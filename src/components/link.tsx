import {
  Link as MuiLink,
  type LinkProps as MuiLinkLinkProps,
} from '@mui/material';
import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps,
} from 'react-router';

interface LinkProps extends Omit<RouterLinkProps, 'color'>, MuiLinkLinkProps {}

export const Link = (props: LinkProps) => {
  return (
    <MuiLink
      underline="hover"
      component={RouterLink}
      {...props}
    />
  );
};
