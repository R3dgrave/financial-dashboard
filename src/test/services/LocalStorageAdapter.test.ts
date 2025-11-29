import { LocalStorageAdapter } from "../../services/LocalStorageAdapter";

const localStorageMock = (function () {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });

describe("LocalStorageAdapter", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test("debe obtener un item de localStorage", () => {
    localStorageMock.setItem("testKey", "testValue");
    expect(LocalStorageAdapter.getItem("testKey")).toBe("testValue");
  });

  test("debe guardar un item en localStorage", () => {
    LocalStorageAdapter.setItem("otroKey", "otroValor");
    expect(localStorageMock.getItem("otroKey")).toBe("otroValor");
  });

  test("debe retornar null si la clave no existe", () => {
    expect(LocalStorageAdapter.getItem("noExiste")).toBeNull();
  });

  describe("cuando window no está definida", () => {
    // Configuración para simular un entorno noode
    let originalWindow: typeof window;

    beforeAll(() => {
      originalWindow = global.window;
      // @ts-ignore: Ignoramos la comprobación de tipo para permitir la redefinición en el mock.
      delete global.window;
    });

    afterAll(() => {
      // Restauramos el entorno
      global.window = originalWindow;
    });

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
