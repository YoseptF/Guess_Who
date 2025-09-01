import { useState } from "react";
import { Button } from "./Button";

interface EditablePlayerNameProps {
  name: string;
  onNameChange: (name: string) => void;
}

export default function EditablePlayerName({
  name,
  onNameChange,
}: EditablePlayerNameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);

  const handleSave = () => {
    onNameChange(tempName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempName(name);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
          autoFocus
        />
        <Button
          onClick={handleSave}
          variant="ghost"
          size="sm"
          className="p-1 h-auto text-green-600"
          title="Save"
        >
          ✓
        </Button>
        <Button
          onClick={handleCancel}
          variant="ghost"
          size="sm"
          className="p-1 h-auto text-red-600"
          title="Cancel"
        >
          ✕
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">{name}</span>
      <Button
        onClick={() => setIsEditing(true)}
        variant="ghost"
        size="sm"
        className="p-1 h-auto"
        title="Edit name"
      >
        ✏️
      </Button>
    </div>
  );
}
