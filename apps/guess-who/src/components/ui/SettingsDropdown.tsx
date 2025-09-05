import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
} from 'shared-ui';
import { Settings } from 'lucide-react';
import { characterProviders } from '../../providers';
import { useSettings } from '../../contexts/SettingsContext';

interface SettingsDropdownProps {
  buttonText?: string;
  showIcon?: boolean;
}

export default function SettingsDropdown({
  buttonText = '',
  showIcon = true,
}: SettingsDropdownProps) {
  const { characterSources, updateCharacterSource } = useSettings();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button title="Game Settings">
          {showIcon && <Settings size={16} />}
          {buttonText && <span>{buttonText}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Character Sources</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {characterProviders.map((provider) => (
          <DropdownMenuCheckboxItem
            key={provider.name}
            checked={characterSources[provider.name] || false}
            onCheckedChange={(checked) =>
              updateCharacterSource(provider.name, checked)
            }
            onSelect={(event: Event) => event.preventDefault()}
          >
            {provider.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
