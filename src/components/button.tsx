import type { ButtonProps as MatButtonProps } from '@mui/material';
import {
  alpha,
  Box,
  CircularProgress,
  Button as MatButton,
  styled,
} from '@mui/material';
import type { ElementType } from 'react';
import { forwardRef } from 'react';

interface ButtonRoot extends MatButtonProps {
  isLoading?: boolean;
}

const ButtonRoot = styled(({ isLoading, ...props }: ButtonRoot) => (
  <MatButton {...props} />
))<ButtonRoot>(({ theme, isLoading, variant }) => ({
  position: 'relative',
  '&.Mui-disabled ': {
    backgroundColor:
      isLoading &&
      variant === 'contained' &&
      alpha(theme.palette.primary.main, 0.36),
  },
  div: {
    '&:first-of-type': {
      visibility: isLoading && 'hidden',
    },
  },
}));

interface ButtonProps extends MatButtonProps {
  isLoading?: boolean;
  component?: ElementType;
}

export const Button = forwardRef(
  ({ isLoading = false, disabled, children, ...rest }: ButtonProps, ref) => {
    return (
      <ButtonRoot
        ref={ref}
        isLoading={isLoading}
        disabled={disabled || isLoading}
        {...rest}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {children}
        </Box>
        {isLoading && (
          <CircularProgress
            size={24}
            color="primary"
            sx={{ position: 'absolute' }}
            thickness={4.2}
          />
        )}
      </ButtonRoot>
    );
  }
);
Button.displayName = 'Button';
