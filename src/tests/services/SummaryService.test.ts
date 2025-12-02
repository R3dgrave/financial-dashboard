import { describe, expect, test, beforeEach } from "vitest";
import { SummaryService } from "../../services/SummaryService";
import Transaction from "../../types/Transaction";

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    category: "Sueldo",
    amount: 5000,
    date: "2025-01-01",
  },
  {
    id: "2",
    type: "expense",
    category: "Comida",
    amount: 1500,
    date: "2025-01-05",
  },
  {
    id: "3",
    type: "expense",
    category: "Transporte",
    amount: 300,
    date: "2025-01-10",
  },
  {
    id: "4",
    type: "income",
    category: "Freelance",
    amount: 1000,
    date: "2025-01-15",
  },
  {
    id: "5",
    type: "expense",
    category: "Transporte",
    amount: 200,
    date: "2025-01-20",
  },
];

describe("SummaryService", () => {
  let summaryService: SummaryService;

  beforeEach(() => {
    summaryService = new SummaryService(mockTransactions);
  });

  // PRUEBA 1: Total de Ingresos (Lógica de Negocio)
  test("debe calcular el total de ingresos correctamente", () => {
    // 5000 (Sueldo) + 1000 (Freelance) = 6000
    const totalIncome = summaryService.getTotalIncome();
    expect(totalIncome).toBe(6000);
  });

  // PRUEBA 2: Total de Gastos
  test("debe calcular el total de gastos correctamente", () => {
    // 1500 (Comida) + 300 (Transporte) + 200 (Transporte) = 2000
    const totalExpenses = summaryService.getTotalExpenses();
    expect(totalExpenses).toBe(2000);
  });

  // PRUEBA 3: Balance
  test("debe calcular el balance correctamente", () => {
    // 6000 (Income) - 2000 (Expenses) = 4000
    const balance = summaryService.getBalance();
    expect(balance).toBe(4000);
  });

  // PRUEBA 4: Agregación por Categoría
  test("debe agregar los gastos por categoría correctamente", () => {
    const expensesByCategory = summaryService.getExpensesByCategory();
    expect(expensesByCategory).toEqual({
      Comida: 1500,
      Transporte: 500, // 300 + 200
    });
  });
});
