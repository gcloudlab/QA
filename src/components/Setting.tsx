import { Accessor, Setter } from "solid-js";
import Toggle from "./Toggle";
import type { Setting } from "./Generator";

interface Props {
  setting: Accessor<Setting>;
  setSetting: Setter<Setting>;
}
export default function Setting({ setting, setSetting }: Props) {
  const handleSetAutoSaveSession = (e) => {
    setSetting({
      ...setting(),
      autoSaveSession: e.target.checked,
    });
  };

  return (
    <div>
      <Toggle title="Auto save current session (can be saved after refreshing)">
        <input
          type="checkbox"
          checked={setting().autoSaveSession}
          onChange={handleSetAutoSaveSession}
        />
      </Toggle>
    </div>
  );
}
