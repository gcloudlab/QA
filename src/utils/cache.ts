export const setCustomKey = (key: string) => {
  if (key) {
    localStorage.setItem("custom-key", key);
  }
};
export const getCustomKey = () => localStorage.getItem("custom-key") || "";
export const clearCustomKey = () => {
  localStorage.removeItem("custom-key");
};
