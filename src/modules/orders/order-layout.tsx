import { Box, Container, Divider, Tab, Tabs } from '@mui/material';
import type { ReactNode } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import { PageHeader } from '../../components/page-header';

interface Tab {
  label: string;
  href: string;
  pathname: string;
}

interface ProductLayoutProps {
  children: ReactNode;
}

export const OrderLayout = ({ children }: ProductLayoutProps) => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { pathname } = useLocation();

  const tabs: Tab[] = [
    {
      label: 'Summary',
      href: `/orders/${orderNumber}`,
      pathname: '/orders/[orderNumber]',
    },
    {
      label: 'Items',
      href: `/orders/${orderNumber}/items`,
      pathname: '/orders/[orderNumber]/items',
    },
  ];

  return (
    <>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PageHeader
            title={`Order ${orderNumber}`}
            backHref="/orders"
            backLabel="Orders"
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
          {children}
        </Container>
      </Box>
    </>
  );
};
