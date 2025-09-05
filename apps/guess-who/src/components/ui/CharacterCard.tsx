import type { Character } from "../../types";

interface CharacterCardProps {
  character: Character;
  isCrossedOut: boolean;
  onClick: () => void;
}

export default function CharacterCard({
  character,
  isCrossedOut,
  onClick,
}: CharacterCardProps) {
  return (
    <div
      className={`relative bg-white/90 rounded-2xl p-4 cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.1)] overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] md:p-2.5 ${
        isCrossedOut ? "opacity-40 scale-95 bg-gray-300/90" : ""
      }`}
      style={{ animation: "cardAppear 0.5s ease forwards" }}
      onClick={onClick}
    >
      <img
        src={character.image}
        alt={character.name}
        className={`w-full h-32 object-cover rounded-lg mb-2.5 transition-all duration-300 md:h-28 ${
          isCrossedOut ? "grayscale" : ""
        }`}
      />
      <h4 className="m-0 text-sm text-gray-800 text-center font-bold md:text-xs">
        {character.name}
      </h4>
      {isCrossedOut && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl text-[#ff4757] pointer-events-none"
          style={{
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            animation: "crossOutAppear 0.3s ease",
          }}
        >
          ✖
        </div>
      )}
    </div>
  );
}
