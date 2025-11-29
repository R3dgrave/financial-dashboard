// Adaptador solo para interactuar con la API del navegador.
export const LocalStorageAdapter = {
  getItem: (key: string) => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value);
  },
};