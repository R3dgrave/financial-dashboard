// hooks/useTransaction.ts
import Transaction from "@/types/Transaction";
import { useLocalStorage } from "./useLocalStorage";
import { FormatterService } from "../services/FormatterService";

export function useTransactions() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    "financial-transactions",
    []
  );

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

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    formatCurrency: FormatterService.formatCurrency,
    formatDate: FormatterService.formatDate,
  };
}