import type { BoxProps } from '@mui/material';
import { Box, IconButton, styled } from '@mui/material';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';

interface ProductImageRootProps extends BoxProps {
  selected: boolean;
  disabled: boolean;
  hovered: boolean;
}

const ProductImageRoot = styled(Box)<ProductImageRootProps>(
  ({ theme, selected, disabled, hovered }) => ({
    alignItems: 'center',
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
    userSelect: 'none',
    zIndex: 1,
    flex: 1,
    boxShadow: selected
      ? `0px 0px 0px 3px ${theme.palette.primary.main}`
      : undefined,
    '&:after': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      opacity: hovered ? 1 : 0,
      transition: 'all 0.2s',
    },
    '&:hover': {
      '&:after': {
        opacity: disabled ? undefined : 1,
      },
    },
    button: {
      display: 'none',
    },
    img: {
      maxWidth: '100%',
    },
  })
);

interface ProductImageProps extends BoxProps {
  image: any;
  onSelect?: any;
  onDelete?: any;
  selected?: boolean;
  disabled?: boolean;
}

export const ProductImage = ({
  image,
  onSelect,
  onDelete,
  selected = false,
  disabled = false,
  ...rest
}: ProductImageProps) => {
  const [buttonHovered, setButtonHovered] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        position: 'relative',
        button: {
          display: 'none',
        },
        '&:hover': {
          button: {
            display: disabled ? undefined : 'inline-flex',
          },
        },
      }}
      {...rest}
    >
      <ProductImageRoot
        selected={selected}
        disabled={disabled}
        onClick={onSelect}
        hovered={buttonHovered}
      >
        <img
          src={image}
          alt=""
        />
      </ProductImageRoot>
      <IconButton
        color="error"
        onMouseLeave={() => {
          setButtonHovered(false);
        }}
        onClick={onDelete}
        onMouseOver={() => {
          setButtonHovered(true);
        }}
        sx={{
          zIndex: 10,
          position: 'absolute',
          bottom: 8,
          right: 8,
        }}
      >
        <TrashIcon />
      </IconButton>
    </Box>
  );
};
