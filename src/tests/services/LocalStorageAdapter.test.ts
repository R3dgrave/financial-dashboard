import { describe, expect, test, beforeEach, vi } from "vitest";
import { LocalStorageAdapter } from "../../services/LocalStorageAdapter";

// Mock de la interfaz Storage
const mockStorage = {
  store: {} as Record<string, string>,
  getItem: (key: string) => mockStorage.store[key] || null,
  setItem: (key: string, value: string) => {
    mockStorage.store[key] = value;
  },
  removeItem: (key: string) => {
    delete mockStorage.store[key];
  },
  clear: () => {
    mockStorage.store = {};
  },
  length: 0,
  key: () => null,
};

describe("LocalStorageAdapter", () => {
  beforeEach(() => {
    vi.spyOn(window, "localStorage", "get").mockReturnValue(
      mockStorage as Storage
    );
    mockStorage.clear();
  });

  test("debe obtener un item de localStorage", () => {
    mockStorage.setItem("testKey", "testValue");
    expect(LocalStorageAdapter.getItem("testKey")).toBe("testValue");
  });

  test("debe guardar un item en localStorage", () => {
    LocalStorageAdapter.setItem("otroKey", "otroValor");
    expect(mockStorage.getItem("otroKey")).toBe("otroValor");
  });

  test("debe retornar null si la clave no existe", () => {
    expect(LocalStorageAdapter.getItem("noExiste")).toBeNull();
  });

  describe("cuando window no está definida (Simulación de entorno Node)", () => {
    vi.spyOn(window, "localStorage", "get").mockReturnValue(
      undefined as unknown as Storage
    );

    test("getItem debe retornar null", () => {
      expect(LocalStorageAdapter.getItem("testKey")).toBeNull();
    });

    test("setItem no debe fallar y debe retornar undefined", () => {
      expect(
        LocalStorageAdapter.setItem("serverKey", "serverValue")
      ).toBeUndefined();
    });
  });
});
