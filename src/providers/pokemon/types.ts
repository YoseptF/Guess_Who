export interface PokemonApiResponse {
  results: PokemonListItem[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    other: {
      "official-artwork": {
        front_default: string | null;
      };
    };
  };
}
