import type { Character, CharacterProvider } from "../../types";
import type { AvatarCharacter } from "./types";

export class AvatarProvider implements CharacterProvider {
  name = "Avatar";

  async fetchCharacters(): Promise<Character[]> {
    try {
      const response = await fetch(
        "https://last-airbender-api.fly.dev/api/v1/characters",
      );
      const data: AvatarCharacter[] = await response.json();

      return data
        .filter((char) => char.photoUrl)
        .map((char, index) => ({
          id: index,
          name: char.name,
          image: char.photoUrl!,
        }));
    } catch (error) {
      console.error("Error fetching Avatar characters:", error);
      return [];
    }
  }
}
