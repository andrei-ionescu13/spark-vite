import { useSettings } from '@/store/settings';
import {
  alpha,
  Box,
  Drawer,
  Fab,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import {
  MoonIcon,
  RotateCcwIcon,
  SlidersHorizontalIcon,
  SunIcon,
  XIcon,
} from 'lucide-react';
import { useDialog } from '../hooks/useDialog';
import type { Preset } from '../theme/colors';
import { colors } from '../theme/colors';
import { CardButton } from './card-button';

const presets: Preset[] = [
  'green',
  'purple',
  'lightBlue',
  'darkBlue',
  'yellow',
  'red',
];

export const ThemeDrawer = () => {
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const { theme, preset, updateTheme, updatePreset, restoreInitialSettings } =
    useSettings();
  const { palette } = useTheme();

  return (
    <>
      {!dialogOpen && (
        <Fab
          size="small"
          color="primary"
          onClick={handleOpenDialog}
          sx={{
            bottom: 64,
            right: 0,
            position: 'fixed',
            zIndex: 999999999,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          <SlidersHorizontalIcon />
        </Fab>
      )}
      <Drawer
        onClose={handleCloseDialog}
        anchor="right"
        open={dialogOpen}
        slotProps={{
          paper: {
            sx: {
              width: 256,
              m: 2,
              height: 'calc(100% - 32px)',
              borderRadius: 1,
              backdropFilter: 'blur(6px)',
              backgroundColor: (theme) =>
                alpha(theme.palette.background.paper, 0.82),
            },
          },
        }}
      >
        <Box
          sx={{
            m: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography
            color="textPrimary"
            variant="body1"
            sx={{ fontWeight: 600 }}
          >
            Settings
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            color="secondary"
            size="small"
            onClick={restoreInitialSettings}
          >
            <RotateCcwIcon fontSize="small" />
          </IconButton>
          <IconButton
            color="secondary"
            size="small"
            onClick={handleCloseDialog}
          >
            <XIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ m: 2 }}>
          <Grid
            container
            spacing={4}
          >
            <Grid size={12}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 1.5,
                }}
              >
                Mode
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 1,
                }}
              >
                <CardButton
                  onClick={() => {
                    updateTheme('light');
                  }}
                  sx={{
                    color:
                      theme === 'light' ? 'primary.main' : 'background.paper',
                    backgroundColor: '#fff',
                  }}
                >
                  <SunIcon
                    color={
                      theme === 'light'
                        ? palette.primary.main
                        : palette.text.secondary
                    }
                  />
                </CardButton>
                <CardButton
                  onClick={() => {
                    updateTheme('dark');
                  }}
                  sx={{
                    color:
                      theme === 'dark' ? 'primary.main' : 'background.paper',
                    backgroundColor: 'background.default',
                  }}
                >
                  <MoonIcon
                    color={
                      theme === 'dark'
                        ? palette.primary.main
                        : palette.text.secondary
                    }
                  />
                </CardButton>
              </Box>
            </Grid>
            <Grid size={12}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 1.5,
                }}
              >
                Presets
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 1,
                }}
              >
                {presets.map((_preset) => {
                  const color = colors[_preset].main;
                  const isActive = _preset === preset;

                  return (
                    <CardButton
                      onClick={() => {
                        updatePreset(_preset);
                      }}
                      key={_preset}
                      sx={{
                        color: color,
                        backgroundColor: 'background.paper',
                        py: 1.75,
                        borderColor: isActive ? color : undefined,
                        boxShadow: isActive
                          ? `${alpha(color, 0.24)} 0px 4px 8px 0px inset`
                          : undefined,
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: color,
                          width: 25,
                          height: 15,
                          borderRadius: '50%',
                          transform: isActive ? 'rotate(-45deg)' : 'rotate(0)',
                          transition: '250ms',
                        }}
                      />
                    </CardButton>
                  );
                })}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
    </>
  );
};
