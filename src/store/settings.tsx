import type { Preset } from '@/theme/colors';
import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface Settings {
  theme: Theme;
  preset: Preset;
}

interface SettingsStore {
  theme: Theme;
  preset: Preset;
  updateTheme: (theme: Theme) => void;
  updatePreset: (preset: Preset) => void;
  restoreInitialSettings: () => void;
}

const defaultSettings: Settings = {
  theme: 'dark',
  preset: 'green',
};

const osTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

export const useSettings = create<SettingsStore>((set) => ({
  theme:
    (localStorage.getItem('theme') as Theme) ||
    osTheme ||
    defaultSettings.theme,
  preset: (localStorage.getItem('preset') as Preset) || defaultSettings.preset,
  updateTheme: (theme: Theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
  updatePreset: (preset: Preset) => {
    localStorage.setItem('preset', preset);
    set({ preset });
  },
  restoreInitialSettings: () =>
    set({
      theme: defaultSettings.theme,
      preset: defaultSettings.preset,
    }),
}));
