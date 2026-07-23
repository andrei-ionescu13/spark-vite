import type { ButtonBaseProps } from '@mui/material';
import { ButtonBase, styled } from '@mui/material';

const CardButtonRoot = styled(ButtonBase)(({ theme }) => ({
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
  display: 'grid',
  placeItems: 'center',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}));

interface CardButtonProps extends ButtonBaseProps {
  cardColor?: string;
}

export const CardButton = ({
  children,
  cardColor,
  ...rest
}: CardButtonProps) => {
  return <CardButtonRoot {...rest}>{children}</CardButtonRoot>;
};
