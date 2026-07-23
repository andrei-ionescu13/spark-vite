import type { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { Box, Container, Divider, Tab, Tabs } from '@mui/material';
import { BanIcon, KeyIcon, TrashIcon } from 'lucide-react';
import { Link, Outlet, useLocation, useParams } from 'react-router';
import { useGetUser } from './api';

interface Tab {
  label: string;
  href: string;
}

export const UserLayout = () => {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading } = useGetUser(id);
  const { pathname } = useLocation();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog(false);
  const [banDialogOpen, handleOpenBanDialog, handleCloseBanDialog] =
    useDialog(false);
  const [resetDialogOpen, handleOpenResetDialog, handleCloseResetDialog] =
    useDialog(false);
  const { email } = user || {};

  const tabs: Tab[] = [
    {
      label: 'General',
      href: `/users/${id}`,
    },
    {
      label: 'Orders',
      href: `/users/${id}/orders`,
    },
    {
      label: 'Reviews',
      href: `/users/${id}/reviews`,
    },
  ];

  const actionItems: ActionsItem[] = [
    {
      label: 'Send reset link',
      icon: KeyIcon,
      onClick: handleOpenResetDialog,
    },
    {
      label: 'Ban',
      icon: BanIcon,
      onClick: handleOpenBanDialog,
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: 'error',
    },
  ];

  return (
    <>
      <title>User</title>
      {!!id && (
        <>
          <AlertDialog
            open={deleteDialogOpen}
            onClose={handleCloseDeleteDialog}
            title={`Delete user ${id}`}
            content="Are you sure you want to permanently delete this user?"
            onSubmit={deleteDialogOpen}
            isLoading={false}
          />
          <AlertDialog
            open={banDialogOpen}
            onClose={handleCloseBanDialog}
            title={`Ban user ${id}`}
            content="Are you sure you want to ban this user?"
            onSubmit={banDialogOpen}
            isLoading={false}
          />
          <AlertDialog
            open={resetDialogOpen}
            onClose={handleCloseResetDialog}
            title={`Reset link`}
            content="Are you sure you want to send a reset link?"
            onSubmit={resetDialogOpen}
            isLoading={false}
          />
        </>
      )}
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PageHeader
            title={email}
            backHref="/users"
            backLabel="Users"
            actions={actionItems}
            isLoading={isLoading}
          />
          <Tabs value={tabs.findIndex((tab) => tab.href === pathname)}>
            {tabs.map((tab) => (
              <Tab
                component={Link}
                key={tab.label}
                to={tab.href}
                label={tab.label}
              />
            ))}
          </Tabs>
          <Divider sx={{ mb: 3 }} />
          <Outlet />
        </Container>
      </Box>
    </>
  );
};
