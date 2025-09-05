import type { Character } from "../../types";

interface SecretCharacterProps {
  character: Character;
}

export default function SecretCharacter({ character }: SecretCharacterProps) {
  return (
    <div
      className="mb-8 text-center"
      style={{ animation: "fadeInDown 0.6s ease" }}
    >
      <h2>Your Secret Character:</h2>
      <div className="bg-white/15 p-5 rounded-3xl backdrop-blur-sm border-2 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-transform duration-300 inline-block hover:scale-105">
        <img
          src={character.image}
          alt={character.name}
          className="w-32 h-32 rounded-2xl object-cover mb-2.5 border-2 border-white/30 md:w-28 md:h-28"
        />
        <h3 className="m-0 text-xl text-white">{character.name}</h3>
      </div>
    </div>
  );
}
