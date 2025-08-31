import { useCallback } from "react";
import { Character, SuperheroApiCharacter } from "../types";

export const useCharacters = () => {
  const fetchCharacters = useCallback(async (): Promise<Character[]> => {
    try {
      const response = await fetch(
        "https://akabab.github.io/superhero-api/api/all.json",
      );
      const data: SuperheroApiCharacter[] = await response.json();

      const selected = data
        .filter((char) => char.images?.sm)
        .sort(() => Math.random() - 0.5)
        .slice(0, 24)
        .map((char, index) => ({
          id: index,
          name: char.name,
          image: char.images.sm!,
        }));

      return selected;
    } catch (error) {
      console.error("Error fetching characters:", error);
      return [];
    }
  }, []);

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
