import { createContext, useContext, useState, type ReactNode } from "react";
import type { CharacterSourceSettings } from "../types";
import { characterProviders } from "../providers";

interface SettingsContextType {
  characterSources: CharacterSourceSettings;
  updateCharacterSource: (source: string, enabled: boolean) => void;
  getEnabledSources: () => string[];
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

const defaultSettings: CharacterSourceSettings = Object.fromEntries(
  characterProviders.map((provider) => [provider.name, true]),
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [characterSources, setCharacterSources] =
    useState<CharacterSourceSettings>(defaultSettings);

  const updateCharacterSource = (source: string, enabled: boolean) => {
    setCharacterSources((prev) => ({ ...prev, [source]: enabled }));
  };

  const getEnabledSources = () => {
    return Object.entries(characterSources)
      .filter(([, enabled]) => enabled)
      .map(([source]) => source);
  };

  return (
    <SettingsContext.Provider
      value={{
        characterSources,
        updateCharacterSource,
        getEnabledSources,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
