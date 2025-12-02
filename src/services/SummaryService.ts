import Transaction from "../types/Transaction";

export class SummaryService {
  private transactions: Transaction[];

  constructor(transactions: Transaction[]) {
    this.transactions = transactions;
  }

  // (SRP)
  // Métodos de agregación básicos
  private getFilteredAmount(type: "income" | "expense"): number {
    return this.transactions
      .filter((t) => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  // Cálculo de Totales
  public getTotalIncome(): number {
    return this.getFilteredAmount("income");
  }

  public getTotalExpenses(): number {
    return this.getFilteredAmount("expense");
  }

  public getBalance(): number {
    return this.getTotalIncome() - this.getTotalExpenses();
  }

  // Cálculo de datos para gráficos
  public getExpensesByCategory(): Record<string, number> {
    return this.transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
  }

  // Método principal para coordinar y devolver un resumen completo
  public getSummary() {
    const totalIncome = this.getTotalIncome();
    const totalExpenses = this.getTotalExpenses();

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      incomeCount: this.transactions.filter((t) => t.type === "income").length,
      expenseCount: this.transactions.filter((t) => t.type === "expense").length,
      expensesByCategory: this.getExpensesByCategory(),
    };
  }
}