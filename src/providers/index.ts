import { SuperheroProvider } from "./superhero/superheroProvider";
import { PokemonProvider } from "./pokemon/pokemonProvider";
import { RickAndMortyProvider } from "./rickandmorty/rickAndMortyProvider";
import { AvatarProvider } from "./avatar/avatarProvider";
import type { CharacterProvider } from "../types";

export const characterProviders: CharacterProvider[] = [
  new SuperheroProvider(),
  new PokemonProvider(),
  new RickAndMortyProvider(),
  new AvatarProvider(),
];

export const getProviderByName = (
  name: string,
): CharacterProvider | undefined => {
  return characterProviders.find((provider) => provider.name === name);
};

export * from "./superhero/superheroProvider";
export * from "./pokemon/pokemonProvider";
export * from "./rickandmorty/rickAndMortyProvider";
export * from "./avatar/avatarProvider";
