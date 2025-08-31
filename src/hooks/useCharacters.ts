import { useCallback } from "react";
import type { Character } from "../types";
import { characterProviders, getProviderByName } from "../providers";

export const useCharacters = () => {
  const fetchCharacters = useCallback(
    async (enabledSources?: string[]): Promise<Character[]> => {
      const sourcesToUse =
        enabledSources && enabledSources.length > 0
          ? enabledSources
          : characterProviders.map((p) => p.name);

      const allCharacters: Character[] = [];
      let globalIndex = 0;

      for (const sourceName of sourcesToUse) {
        const provider = getProviderByName(sourceName);
        if (provider) {
          try {
            const characters = await provider.fetchCharacters();
            const reindexedCharacters = characters.map((char) => ({
              ...char,
              id: globalIndex++,
            }));
            allCharacters.push(...reindexedCharacters);
          } catch (error) {
            console.error(
              `Error fetching characters from ${sourceName}:`,
              error,
            );
          }
        }
      }

      const shuffled = allCharacters
        .sort(() => Math.random() - 0.5)
        .slice(0, 24);

      return shuffled;
    },
    [],
  );

  const shuffleArray = useCallback(<T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  return {
    fetchCharacters,
    shuffleArray,
  };
};
