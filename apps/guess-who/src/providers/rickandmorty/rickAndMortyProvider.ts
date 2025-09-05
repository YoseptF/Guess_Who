import type { Character, CharacterProvider } from "../../types";
import type { RickAndMortyApiResponse } from "./types";

export class RickAndMortyProvider implements CharacterProvider {
  name = "Rick & Morty";

  async fetchCharacters(): Promise<Character[]> {
    try {
      const response = await fetch("https://rickandmortyapi.com/api/character");
      const data: RickAndMortyApiResponse = await response.json();

      return data.results.map((char, index) => ({
        id: index,
        name: char.name,
        image: char.image,
      }));
    } catch (error) {
      console.error("Error fetching Rick & Morty characters:", error);
      return [];
    }
  }
}
