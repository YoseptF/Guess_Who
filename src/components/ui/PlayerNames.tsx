import EditablePlayerName from "./EditablePlayerName";

interface PlayerNamesProps {
  myName: string;
  opponentName: string;
  myWins: number;
  opponentWins: number;
  onNameChange: (newName: string) => void;
}

export default function PlayerNames({
  myName,
  opponentName,
  myWins,
  opponentWins,
  onNameChange,
}: PlayerNamesProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg border border-white/20">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
            <span className="text-sm font-medium text-gray-700">You:</span>
          </div>
          <EditablePlayerName name={myName} onNameChange={onNameChange} />
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            {myWins} wins
          </div>
        </div>

        <div className="w-px h-8 bg-gray-200"></div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
            <span className="text-sm font-medium text-gray-700">Opponent:</span>
          </div>
          <span className="font-semibold text-gray-800 min-w-0 truncate">
            {opponentName}
          </span>
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            {opponentWins} wins
          </div>
        </div>
      </div>
    </div>
  );
}
