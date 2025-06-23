import { useTransactions } from "../hooks/useTransaction";

interface AmountDisplayProps {
  amount: number;
  type: "income" | "expense";
  showSign?: boolean;
}

export function AmountDisplay({
  amount,
  type,
  showSign = true,
}: AmountDisplayProps) {
  const { formatCurrency } = useTransactions();

  const colorClass = type === "income" ? "text-green-600" : "text-red-600";
  const sign = showSign ? (type === "income" ? "+" : "-") : "";

  return (
    <span className={`font-medium ${colorClass}`}>
      {sign}
      {formatCurrency(amount)}
    </span>
  );
}
