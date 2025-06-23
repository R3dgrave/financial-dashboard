import { useMemo } from "react";
import Transaction from "../interface/Transaction";

export function useFinancialSummary(transactions: Transaction[]) {
  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    const incomeCount = transactions.filter((t) => t.type === "income").length;
    const expenseCount = transactions.filter(
      (t) => t.type === "expense"
    ).length;

    // Datos para el gráfico por categorías (solo gastos)
    const expensesByCategory = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return {
      totalIncome,
      totalExpenses,
      balance,
      incomeCount,
      expenseCount,
      expensesByCategory,
    };
  }, [transactions]);

  return summary;
}
