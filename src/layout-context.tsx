import { useDialog } from '@/hooks/useDialog';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

interface LayoutContextValue {
  sidebarOpen: boolean;
  handleSidebarOpen: () => void;
  handleSidebarClose: () => void;
}

export const LayoutContext = createContext<LayoutContextValue>({
  sidebarOpen: false,
  handleSidebarOpen: () => {},
  handleSidebarClose: () => {},
});

interface LayoutProviderProps {
  children?: ReactNode;
}

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
  const [sidebarOpen, handleSidebarOpen, handleSidebarClose] = useDialog();

  return (
    <LayoutContext.Provider
      value={{
        sidebarOpen,
        handleSidebarOpen,
        handleSidebarClose,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);
