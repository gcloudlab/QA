export const setCustomKey = (key: string, value: string) => {
  if (typeof window !== "undefined" && key) {
    localStorage.setItem(key, value);
  }
};
export const getCustomKey = (key: string) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key) || "";
  }
  return "";
};
export const clearCustomKey = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("custom-key");
  }
};

export const getSession = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("custom-key") || "";
  }
  return "";
};
