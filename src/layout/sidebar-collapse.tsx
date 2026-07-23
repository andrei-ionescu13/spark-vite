import { Box, Collapse, List, ListItem } from '@mui/material';
import { ChevronRightIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import type { Item } from './sidebar';
import { SidebarListItem } from './sidebar-collapse-item';
import { SidebarItem } from './sidebar-item';

interface SidebarCollapseProps {
  item: Item;
  onClick: any;
  open?: boolean;
}

export const SidebarCollapse = ({
  item,
  onClick,
  open = false,
}: SidebarCollapseProps) => {
  const { pathname } = useLocation();
  const { icon: Icon } = item;

  const active = !!item?.subitems?.some((item) => pathname === item.href);

  return (
    <>
      <ListItem
        disableGutters
        disablePadding
      >
        <SidebarItem
          active={active}
          onClick={() => onClick(item.title)}
        >
          <Icon />
          {item.title}
          <Box sx={{ flexGrow: 1 }} />
          <ChevronRightIcon
            sx={{
              transform: open ? 'rotate(90deg)' : 'rotate(0)',
              transition: '300ms',
            }}
          />
        </SidebarItem>
      </ListItem>
      <Collapse in={open}>
        <List
          disablePadding
          sx={{ width: '100%' }}
        >
          {item?.subitems?.map((item) => {
            return (
              <ListItem
                disableGutters
                disablePadding
                key={item.title}
              >
                <SidebarListItem
                  component={Link}
                  to={item.href}
                  sx={{ pl: 6 }}
                >
                  {item.title}
                </SidebarListItem>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </>
  );
};
