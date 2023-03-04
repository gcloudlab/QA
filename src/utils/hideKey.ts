export const hideKey = (key: string) =>
  key.slice(0, 2) + "***********" + key.slice(key.length - 3);
