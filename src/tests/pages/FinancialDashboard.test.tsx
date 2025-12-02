import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FinancialDashboard from "../../pages/FinancialDashboard";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

const mockDeleteTransaction = vi.fn();
const mockAddTransaction = vi.fn();

vi.mock("@/hooks/useTransaction", () => ({
  useTransactions: vi.fn(() => ({
    transactions: [
      {
        id: "t1",
        date: new Date("2025-12-01"),
        type: "income",
        category: "Salario",
        description: "Pago de nómina",
        amount: 5000,
      },
      {
        id: "t2",
        date: new Date("2025-12-02"),
        type: "expense",
        category: "Alquiler",
        description: "Renta del mes",
        amount: 1200,
      },
    ],
    addTransaction: mockAddTransaction,
    deleteTransaction: mockDeleteTransaction,
    formatCurrency: (amount: number) => {
      const value = Math.abs(amount);
      return `$${value.toFixed(2)}`;
    },
    formatDate: (date: Date) => new Date(date).toLocaleDateString("es-ES"),
  })),
}));

vi.mock("@/hooks/useFinancialSummary", () => ({
  useFinancialSummary: vi.fn(() => ({
    totalIncome: 5000,
    totalExpenses: 1200,
    balance: 3800,
    incomeCount: 1,
    expenseCount: 1,
    expensesByCategory: [{ name: "Alquiler", value: 1200 }],
  })),
}));

vi.mock("../components/Header", () => ({
  default: () => (
    <div data-testid="mock-header">Dashboard Financiero Personal</div>
  ),
}));

vi.mock("../components/TransactionForm", () => ({
  default: ({
    onAddTransaction,
  }: {
    onAddTransaction: (transaction: { id: string; amount: number }) => void;
  }) => (
    <button
      data-testid="mock-transaction-form-button"
      onClick={() => onAddTransaction({ id: "t3", amount: 100 })}
    >
      Añadir Transacción (Mock)
    </button>
  ),
}));

vi.mock("@/components/TransactionForm", () => ({
  default: ({
    onAddTransaction,
  }: {
    onAddTransaction: (transaction: { id: string; amount: number }) => void;
  }) => (
    <button
      data-testid="mock-transaction-form-button"
      onClick={() => onAddTransaction({ id: "t3", amount: 100 })}
    >
      Añadir Transacción (Mock)
    </button>
  ),
}));

vi.mock("../components/ExpenseChart", () => ({
  ExpenseChart: () => (
    <div data-testid="mock-expense-chart">Gráfico de Gastos (Mock)</div>
  ),
}));

vi.mock("@/components/AmountDisplay", () => ({
  AmountDisplay: ({ amount, type }: { amount: number; type: string }) => (
    <span data-testid={`amount-display-${type}`}>
      {type === "expense" ? "-" : "+"}${amount.toFixed(2)}
    </span>
  ),
}));

describe("(FinancialDashboard Refactorizado)", () => {
  it("debe renderizar el dashboard principal y sus componentes orquestados", () => {
    render(<FinancialDashboard />);
    expect(
      screen.getByText(/Dashboard Financiero Personal/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Añadir Transacción (Mock)")).toBeInTheDocument();
    expect(screen.getByTestId("mock-expense-chart")).toBeInTheDocument();
  });

  it("debe mostrar el resumen financiero correcto (Ingresos, Gastos, Balance)", () => {
    render(<FinancialDashboard />);

    // Ingresos Totales
    const incomeCard = screen.getByTestId("summary-card-ingresos-totales");
    expect(incomeCard).toHaveTextContent("Ingresos Totales");
    expect(incomeCard).toHaveTextContent("$5000.00");
    expect(incomeCard).toHaveTextContent("+1 transacciones");

    // Gastos Totales
    const expenseCard = screen.getByTestId("summary-card-gastos-totales");
    expect(expenseCard).toHaveTextContent("Gastos Totales");
    expect(expenseCard).toHaveTextContent("$1200.00");
    expect(expenseCard).toHaveTextContent("-1 transacciones");

    // Balance
    const balanceCard = screen.getByTestId("summary-card-balance");
    expect(balanceCard).toHaveTextContent("Balance");
    expect(balanceCard).toHaveTextContent("$3800.00");
    expect(balanceCard).toHaveTextContent("Saldo positivo");
  });

  it("debe mostrar la lista de transacciones con los datos mockeados", () => {
    render(<FinancialDashboard />);
    expect(screen.getByText("Pago de nómina")).toBeInTheDocument();
    expect(screen.getByText("Renta del mes")).toBeInTheDocument();
    expect(screen.getByTestId("amount-display-income")).toHaveTextContent(
      "+$5000.00"
    );
    expect(screen.getByTestId("amount-display-expense")).toHaveTextContent(
      "-$1200.00"
    );
  });

  it("debe llamar a deleteTransaction al hacer clic en el botón de eliminar", () => {
    render(<FinancialDashboard />);
    const deleteButtons = screen.getAllByLabelText(/Eliminar transacción/i);
    expect(deleteButtons).toHaveLength(2);
    fireEvent.click(deleteButtons[0]);
    expect(mockDeleteTransaction).toHaveBeenCalledTimes(1);
    expect(mockDeleteTransaction).toHaveBeenCalledWith("t1");
  });
});
