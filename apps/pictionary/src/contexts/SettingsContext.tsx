import { createContext, useContext, useState, type ReactNode } from 'react';
import type { WordProviderSettings } from '../types';
import { wordProviders } from '../providers';

interface SettingsContextType {
  wordProviderSettings: WordProviderSettings;
  updateWordProvider: (provider: string, enabled: boolean) => void;
  getEnabledProviders: () => string[];
  timerDuration: number;
  setTimerDuration: (duration: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

const defaultSettings: WordProviderSettings = Object.fromEntries(
  wordProviders.map(provider => [provider.name, true]),
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [wordProviderSettings, setWordProviderSettings] =
    useState<WordProviderSettings>(defaultSettings);
  const [timerDuration, setTimerDuration] = useState(120);

  const updateWordProvider = (provider: string, enabled: boolean) => {
    setWordProviderSettings(prev => ({ ...prev, [provider]: enabled }));
  };

  const getEnabledProviders = () =>
    Object.entries(wordProviderSettings)
      .filter(([, enabled]) => enabled)
      .map(([provider]) => provider);

  return (
    <SettingsContext.Provider
      value={{
        wordProviderSettings,
        updateWordProvider,
        getEnabledProviders,
        timerDuration,
        setTimerDuration,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
