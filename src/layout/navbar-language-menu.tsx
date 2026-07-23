import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { useRef, useState } from 'react';

const NEXT_LOCALE = 'NEXT_LOCALE';
const languageOptions = [
  {
    name: 'English',
    flag: 'us.svg',
    code: 'en',
  },
  {
    name: 'Dutch',
    flag: 'de.svg',
    code: 'de',
  },
  {
    name: 'French',
    flag: 'fr.svg',
    code: 'fr',
  },
  {
    name: 'Spanish',
    flag: 'es.svg',
    code: 'es',
  },
];

export const NavbarLanguageMenu = () => {
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleLanguageChange = (language: string): void => {
    // const { pathname, asPath, query } = router;
    // router.push({ pathname, query }, asPath, { locale: language });
  };

  return (
    <div>
      <Button
        ref={buttonRef}
        onClick={handleOpen}
        color="primary"
        sx={{ minWidth: 'fit-content' }}
      >
        {/* <img
          src={`/flags/${languageOptions.find((option) => option.code === router.locale)?.flag}`}
          alt={
            languageOptions.find((option) => option.code === router.locale)
              ?.name
          }
        /> */}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={buttonRef.current}
        open={open}
        onClose={handleClose}
      >
        {languageOptions.map((option) => (
          <MenuItem
            onClick={() => handleLanguageChange(option.code)}
            key={option.code}
          >
            <img
              src={`/flags/${option.flag}`}
              alt={option.code}
            />
            <Typography
              sx={{ ml: 1 }}
              color="textPrimary"
              variant="subtitle2"
            >
              {option.name}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
