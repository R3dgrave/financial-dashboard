import { useMemo } from "react";
import Transaction from "../types/Transaction";
import { SummaryService } from "../services/SummaryService";

export function useFinancialSummary(transactions: Transaction[]) {
  const summary = useMemo(() => {
    const calculator = new SummaryService(transactions);
    return calculator.getSummary(); 
  }, [transactions]);

  return summary;
}