import { Box, MenuItem, Select, type BaseSelectProps } from '@mui/material';

interface BulletProps {
  color: string;
}

export const Bullet = ({ color }: BulletProps) => {
  return (
    <Box
      sx={{
        width: '6px',
        height: '6px',
        backgroundColor: color,
        borderRadius: '50%',
      }}
    />
  );
};

export interface StatusOption {
  color: string;
  value: string;
  label: string;
}

interface StatusSelectProps extends BaseSelectProps {
  options: StatusOption[];
}

export const StatusSelect = ({ options, ...rest }: StatusSelectProps) => {
  return (
    <Select {...rest}>
      {options.map((option) => (
        <MenuItem
          value={option.value}
          key={option.value}
          color={option.color}
        >
          <Box
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              gap: 1,
              alignItems: 'center',
              justifyContent: 'start',
              lineHeight: 1.4,
            }}
          >
            <Bullet color={option.color} />
            {option.label}
          </Box>
        </MenuItem>
      ))}
    </Select>
  );
};
