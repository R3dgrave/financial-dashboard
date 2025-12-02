import { renderHook } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach, Mock } from "vitest";
import { useFinancialSummary } from "../../hooks/useFinancialSummary";
import { SummaryService } from "../../services/SummaryService";
import Transaction from "../../types/Transaction";

const mockSummary = {
  totalIncome: 1000,
  totalExpense: 200,
  netBalance: 800,
  balanceStatus: "positive",
};

interface MockedSummaryServiceInstance {
  getSummary: Mock;
}

vi.mock("../../services/SummaryService", () => {
  const MockedSummaryService = vi.fn(function (
    this: MockedSummaryServiceInstance
  ) {
    this.getSummary = vi.fn(() => mockSummary);
  }) as unknown as typeof SummaryService & Mock;

  return {
    SummaryService: MockedSummaryService,
  };
});

const MockedSummaryService = vi.mocked(SummaryService);

describe("useFinancialSummary", () => {
  const mockTransactions: Transaction[] = [
    {
      id: "1",
      type: "income",
      amount: 500,
      category: "Salary",
      date: "2025-11-01",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    MockedSummaryService.mockImplementation(function (
      this: MockedSummaryServiceInstance
    ) {
      this.getSummary = vi.fn(() => mockSummary);
    } as unknown as typeof SummaryService);
  });

  test("debe llamar a SummaryService con las transacciones y retornar el resultado", () => {
    const { result } = renderHook(() => useFinancialSummary(mockTransactions));
    expect(MockedSummaryService).toHaveBeenCalledWith(mockTransactions);
    expect(MockedSummaryService).toHaveBeenCalledTimes(1);
    const instance = MockedSummaryService.mock.instances[0];
    expect(instance.getSummary).toHaveBeenCalledTimes(1);
    expect(result.current).toEqual(mockSummary);
  });

  test("debe usar useMemo y NO recalcular el resumen si la lista de transacciones no cambia", () => {
    const initialTransactions: Transaction[] = [
      {
        id: "2",
        type: "expense",
        amount: 50,
        category: "Food",
        date: "2025-11-02",
      },
    ];
    const getSummaryMock = vi.fn(() => mockSummary);
    MockedSummaryService.mockImplementation(function (
      this: MockedSummaryServiceInstance
    ) {
      this.getSummary = getSummaryMock;
    } as unknown as typeof SummaryService);
    const { rerender } = renderHook(
      ({ transactions }) => useFinancialSummary(transactions),
      {
        initialProps: { transactions: initialTransactions },
      }
    );

    expect(MockedSummaryService).toHaveBeenCalledTimes(1);
    expect(getSummaryMock).toHaveBeenCalledTimes(1);
    rerender({ transactions: initialTransactions });
    expect(MockedSummaryService).toHaveBeenCalledTimes(1);
    expect(getSummaryMock).toHaveBeenCalledTimes(1);
    const newTransactions: Transaction[] = [
      ...initialTransactions,
      {
        id: "3",
        type: "income",
        amount: 100,
        category: "Gift",
        date: "2025-11-03",
      },
    ];
    rerender({ transactions: newTransactions });
    expect(MockedSummaryService).toHaveBeenCalledTimes(2);
    expect(MockedSummaryService).toHaveBeenCalledWith(newTransactions);
    expect(getSummaryMock).toHaveBeenCalledTimes(2);
  });
});
