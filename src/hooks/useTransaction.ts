import Transaction from "@/interface/Transaction";
import { useLocalStorage } from "./useLocalStorage";

export function useTransactions() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    "financial-transactions",
    []
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number, total: number) => {
    if (total === 0) return "0%";
    return `${((value / total) * 100).toFixed(1)}%`;
  };

  const formatCurrencyInput = (value: string) => {
    // Remover todo excepto números
    const numericValue = value.replace(/[^\d]/g, "");
    if (!numericValue) return "";
    // Formatear con separadores de miles
    return new Intl.NumberFormat("es-CL").format(Number.parseInt(numericValue));
  };

  const parseCurrencyInput = (value: string): number => {
    // Remover separadores y convertir a número
    const numericValue = value.replace(/[^\d]/g, "");
    return Number.parseInt(numericValue) || 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAllTransactions = () => {
    setTransactions([]);
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    clearAllTransactions,
    formatCurrency,
    formatDate,
    formatPercent,
    formatCurrencyInput,
    parseCurrencyInput,
  };
}
