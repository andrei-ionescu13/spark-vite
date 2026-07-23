import { Box, Skeleton, Typography } from '@mui/material';
import { ArrowLeftIcon } from 'lucide-react';
import type { ElementType, ReactNode } from 'react';
import { Link } from 'react-router';
import { Actions } from './actions';
import type { ActionsItem } from './actions-menu';
import { Button } from './button';

export interface ActionI {
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  href?: string;
  icon?: ElementType;
  label: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  title?: string;
  backHref?: string;
  backLabel?: string;
  action?: ActionsItem;
  actions?: ActionsItem[];
  children?: ReactNode;
  isLoading?: boolean;
}

interface ActionProps {
  action: ActionsItem;
  isLoading?: boolean;
}

const Action = ({ action, isLoading }: ActionProps) => {
  const Icon = action?.icon;

  if (action?.href) {
    return (
      <Button
        color={action.color || 'primary'}
        variant="contained"
        component={Link}
        to={action.href}
      >
        {Icon && <Icon sx={{ mr: 1 }} />}
        {action.label}
      </Button>
    );
  }

  return (
    <Button
      color={action.color || 'primary'}
      variant="contained"
      onClick={action?.onClick}
      disabled={isLoading}
    >
      {Icon && <Icon sx={{ mr: 1 }} />}
      {action?.label}
    </Button>
  );
};

export const PageHeader = ({
  isLoading,
  title,
  backHref,
  backLabel,
  action,
  actions,
  children,
}: PageHeaderProps) => {
  return (
    <Box sx={{ mb: 4 }}>
      {backHref && backLabel && (
        <Button
          color="primary"
          component={Link}
          to={backHref}
          sx={{ mb: 1 }}
          variant="text"
        >
          <ArrowLeftIcon sx={{ mr: 1 }} />
          {backLabel}
        </Button>
      )}
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <Typography
          color="textPrimary"
          variant="h4"
        >
          {isLoading && !title ? (
            <Skeleton
              variant="text"
              width={250}
            />
          ) : (
            title
          )}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {!!action && (
          <Action
            action={action}
            isLoading={isLoading}
          />
        )}
        {!!actions?.length && (
          <Actions
            items={actions}
            isLoading={isLoading}
          />
        )}
      </Box>
      {!!children && <Box sx={{ mt: 2 }}>{children}</Box>}
    </Box>
  );
};
