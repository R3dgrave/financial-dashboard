import { useState, useEffect } from "react";
import { LocalStorageAdapter } from "../services/LocalStorageAdapter";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  const getValue = (): T => {
    try {
      const item = LocalStorageAdapter.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return initialValue;
    } catch (error) {
      console.error(`Error al leer clave localStorage "${key}":`, error);
      return initialValue;
    }
  };

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      const serializedValue = JSON.stringify(valueToStore);
      LocalStorageAdapter.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error al guardar clave localStorage "${key}":`, error);
    }
  };

  useEffect(() => {
    setStoredValue(getValue());
  }, []);

  return [storedValue, setValue] as const;
}
