export const setCustomKey = (key: string) => {
  if (typeof window !== "undefined" && key) {
    localStorage.setItem("custom-key", key);
  }
};
export const getCustomKey = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("custom-key") || "";
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
