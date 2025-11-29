import { renderHook, act } from "@testing-library/react";
import { useTransactions } from "../../hooks/useTransaction";
import { FormatterService } from "../../services/FormatterService";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import Transaction from "../../types/Transaction"; // Asegura la ruta correcta

jest.mock("../../services/FormatterService", () => ({
  FormatterService: {
    formatCurrency: jest.fn((amount) => `CLP ${amount}`),
    formatDate: jest.fn(() => "01/01/2025"),
  },
}));

const mockSetTransactions = jest.fn();
const mockTransactions: Transaction[] = [
  { id: "1", type: "income", amount: 100, category: "Old", date: "2025-01-01" },
];

jest.mock("../../hooks/useLocalStorage", () => ({
  useLocalStorage: jest.fn(() => [mockTransactions, mockSetTransactions]),
}));

describe("useTransactions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLocalStorage as jest.Mock).mockReturnValue([
      mockTransactions,
      mockSetTransactions,
    ]);
  });

  test("debe exportar las funciones de formato delegadas a FormatterService", () => {
    const { result } = renderHook(() => useTransactions());

    expect(result.current.formatCurrency(500)).toBe("CLP 500");
    expect(FormatterService.formatCurrency).toHaveBeenCalledWith(500);
  });

  test("addTransaction debe agregar una nueva transacción al estado", () => {
    const { result } = renderHook(() => useTransactions());
    const newTx = {
      type: "expense" as const,
      amount: 50,
      category: "New",
      date: "2025-11-28",
    };

    act(() => {
      result.current.addTransaction(newTx);
    });

    expect(mockSetTransactions).toHaveBeenCalled();
    const updateFunction = mockSetTransactions.mock.calls[0][0];
    const newArray = updateFunction(mockTransactions);

    expect(newArray.length).toBe(2);
    expect(newArray[0].amount).toBe(50);
    expect(newArray[0].id).toBeDefined();
  });

  test("deleteTransaction debe remover la transacción por ID", () => {
    const { result } = renderHook(() => useTransactions());

    act(() => {
      result.current.deleteTransaction("1");
    });

    expect(mockSetTransactions).toHaveBeenCalled();
    const updateFunction = mockSetTransactions.mock.calls[0][0];
    const newArray = updateFunction(mockTransactions);

    expect(newArray.length).toBe(0);
  });
});
