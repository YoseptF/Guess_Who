import type { Character, CharacterProvider } from "../../types";
import type { PokemonApiResponse, Pokemon } from "./types";

export class PokemonProvider implements CharacterProvider {
  name = "Pokemon";

  async fetchCharacters(): Promise<Character[]> {
    try {
      const listResponse = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0",
      );
      const listData: PokemonApiResponse = await listResponse.json();

      const pokemonPromises = listData.results
        .slice(0, 50)
        .map(async (pokemon, index) => {
          try {
            const detailResponse = await fetch(pokemon.url);
            const detail: Pokemon = await detailResponse.json();

            const image =
              detail.sprites.other["official-artwork"].front_default ||
              detail.sprites.front_default;

            if (image) {
              return {
                id: index,
                name:
                  detail.name.charAt(0).toUpperCase() + detail.name.slice(1),
                image,
              };
            }
            return null;
          } catch (error) {
            console.debug(`Error fetching pokemon ${pokemon.name}:`, error);
            return null;
          }
        });

      const results = await Promise.all(pokemonPromises);
      return results.filter(
        (pokemon): pokemon is Character => pokemon !== null,
      );
    } catch (error) {
      console.error("Error fetching Pokemon characters:", error);
      return [];
    }
  }
}
