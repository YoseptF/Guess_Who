import { useSettings } from "../../contexts/SettingsContext";
import { characterProviders } from "../../providers";

export default function CharacterSettings() {
  const { characterSources, updateCharacterSource } = useSettings();

  return (
    <div className="character-settings">
      <h3>Character Sources</h3>
      <div className="settings-grid">
        {characterProviders.map((provider) => (
          <label key={provider.name} className="setting-item">
            <input
              type="checkbox"
              checked={characterSources[provider.name] || false}
              onChange={(e) =>
                updateCharacterSource(provider.name, e.target.checked)
              }
            />
            <span>{provider.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
