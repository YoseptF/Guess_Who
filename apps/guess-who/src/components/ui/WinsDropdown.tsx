import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

import { Button } from "./Button";
import { Trophy } from "lucide-react";

interface WinsDropdownProps {
  myName: string;
  opponentName: string;
  onAddWinToMe: () => void;
  onAddWinToOpponent: () => void;
}

export default function WinsDropdown({
  myName,
  opponentName,
  onAddWinToMe,
  onAddWinToOpponent,
}: WinsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button title="Manage Wins">
          <Trophy size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Add Win</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onAddWinToMe}>
          Add win to {myName}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onAddWinToOpponent}>
          Add win to {opponentName}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
