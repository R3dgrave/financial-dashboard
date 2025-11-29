import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { LocalStorageAdapter } from "../../services/LocalStorageAdapter";

jest.mock("../../services/LocalStorageAdapter", () => ({
  LocalStorageAdapter: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

const mockGetItem = LocalStorageAdapter.getItem as jest.Mock;
const mockSetItem = LocalStorageAdapter.setItem as jest.Mock;

describe("useLocalStorage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debe inicializar el estado con el valor guardado en localStorage", () => {
    const storedObject = { data: "stored data" };
    mockGetItem.mockReturnValue(JSON.stringify(storedObject));

    const { result } = renderHook(() => useLocalStorage("objectKey", {}));

    expect(mockGetItem).toHaveBeenCalledWith("objectKey");
    expect(result.current[0]).toEqual(storedObject);
  });

  test("debe inicializar con el valor inicial si localStorage está vacío", () => {
    mockGetItem.mockReturnValue(null);

    const { result } = renderHook(() => useLocalStorage("testKey", "default"));
    expect(result.current[0]).toBe("default");
  });

  test("debe actualizar el estado y guardar en localStorage al llamar a setValue", () => {
    const { result } = renderHook(() => useLocalStorage("updateKey", 10));

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

    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });

    expect(result.current[0]).toBe(6);
    expect(mockSetItem).toHaveBeenCalledWith("countKey", "6");
  });
});
