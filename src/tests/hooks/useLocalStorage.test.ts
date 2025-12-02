import { renderHook, act } from "@testing-library/react";
import {
  describe,
  expect,
  test,
  beforeEach,
  vi,
  Mock,
  afterEach,
} from "vitest";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { LocalStorageAdapter } from "../../services/LocalStorageAdapter";

vi.mock("../../services/LocalStorageAdapter", () => ({
  LocalStorageAdapter: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
}));

const mockGetItem = LocalStorageAdapter.getItem as Mock;
const mockSetItem = LocalStorageAdapter.setItem as Mock;

describe("useLocalStorage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as Mock).mockRestore();
  });

  test("debe inicializar el estado con el valor guardado en localStorage", () => {
    const storedObject = { data: "stored data" };
    mockGetItem.mockReturnValue(JSON.stringify(storedObject));
    const { result } = renderHook(() => useLocalStorage("objectKey", {}));
    expect(mockGetItem).toHaveBeenCalledWith("objectKey");
    act(() => {});
    expect(result.current[0]).toEqual(storedObject);
  });

  test("debe inicializar con el valor inicial si localStorage está vacío", () => {
    mockGetItem.mockReturnValue(null);
    const { result } = renderHook(() => useLocalStorage("testKey", "default"));
    act(() => {});
    expect(result.current[0]).toBe("default");
  });

  test("debe actualizar el estado y guardar en localStorage al llamar a setValue", () => {
    const { result } = renderHook(() => useLocalStorage("updateKey", 10));
    act(() => {});
    const newValue = 20;
    act(() => {
      result.current[1](newValue);
    });
    expect(result.current[0]).toBe(newValue);
    expect(mockSetItem).toHaveBeenCalledWith(
      "updateKey",
      JSON.stringify(newValue)
    );
  });

  test("setValue debe manejar funciones de actualización de estado", () => {
    const { result } = renderHook(() => useLocalStorage("countKey", 5));
    act(() => {});
    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });
    expect(result.current[0]).toBe(6);
    expect(mockSetItem).toHaveBeenCalledWith("countKey", "6");
  });

  test("debe usar el valor inicial si JSON.parse falla en la lectura", () => {
    mockGetItem.mockReturnValue("{esto no es json valido");
    const { result } = renderHook(() =>
      useLocalStorage("errorKey", "safeValue")
    );
    act(() => {});
    expect(result.current[0]).toBe("safeValue");
    expect(console.error).toHaveBeenCalled();
  });

  test("debe registrar un error si LocalStorageAdapter.setItem falla", () => {
    mockSetItem.mockImplementation(() => {
      throw new Error("Storage full");
    });
    const { result } = renderHook(() => useLocalStorage("errorSetKey", 1));
    act(() => {
      result.current[1](2);
    });
    expect(result.current[0]).toBe(2);
    expect(console.error).toHaveBeenCalled();
  });
});
