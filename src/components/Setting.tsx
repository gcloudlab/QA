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
  const handleSetUseFreeKey = (e) => {
    setSetting({
      ...setting(),
      useFreeKey: e.target.checked,
    });
  };
  const handleSetdeleteAllMsg = (e) => {
    setSetting({
      ...setting(),
      deleteAllMsg: e.target.checked,
    });
  };
  const handleSetSystemRole = (e) => {
    setSetting({
      ...setting(),
      preSystemRole: e.target.checked,
    });
  };

  return (
    <div class="setting-wrapper">
      <Toggle title="自动保存当前会话 (网站刷新后依然存在)">
        <input
          type="checkbox"
          checked={setting().autoSaveSession}
          onChange={handleSetAutoSaveSession}
        />
      </Toggle>
      <Toggle title="使用免费体验密钥">
        <input
          type="checkbox"
          checked={setting().useFreeKey}
          onChange={handleSetUseFreeKey}
        />
      </Toggle>
      <Toggle title="激活系统角色设置（开发中）">
        <input
          type="checkbox"
          checked={setting().preSystemRole}
          onChange={handleSetSystemRole}
        />
      </Toggle>
      <Toggle title="删除当前及之后的会话（开发中）">
        <input
          type="checkbox"
          checked={setting().deleteAllMsg}
          onChange={handleSetdeleteAllMsg}
        />
      </Toggle>
    </div>
  );
}
