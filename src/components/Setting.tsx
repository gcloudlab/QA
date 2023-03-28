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
  const handleSetContinuous = (e) => {
    setSetting({
      ...setting(),
      continuousConversation: e.target.checked,
    });
  };
  const handleSetUseProxyApi = (e) => {
    setSetting({
      ...setting(),
      useProxyApi: e.target.checked,
    });
  };

  return (
    <div class="setting-wrapper">
      <Toggle title="开启连续对话 (消耗额度增加)">
        <input
          type="checkbox"
          checked={setting().continuousConversation}
          onChange={handleSetContinuous}
        />
      </Toggle>
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
      <Toggle title="使用自部署代理官网接口 (暂无免费接口，请勿开启)">
        <input
          type="checkbox"
          checked={setting().useProxyApi}
          onChange={handleSetUseProxyApi}
        />
      </Toggle>
    </div>
  );
}
