import type {
  Character,
  CharacterProvider,
  SuperheroApiCharacter,
} from "../../types";

export class SuperheroProvider implements CharacterProvider {
  name = "Superheroes";

  async fetchCharacters(): Promise<Character[]> {
    try {
      const response = await fetch(
        "https://akabab.github.io/superhero-api/api/all.json",
      );
      const data: SuperheroApiCharacter[] = await response.json();

      return data
        .filter((char) => char.images?.sm)
        .map((char, index) => ({
          id: index,
          name: char.name,
          image: char.images.sm!,
        }));
    } catch (error) {
      console.error("Error fetching superhero characters:", error);
      return [];
    }
  }
}
