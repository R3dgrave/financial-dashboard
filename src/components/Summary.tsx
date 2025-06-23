import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const Summary = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Totales
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{transactions.filter((t) => t.type === "income").length}
              transacciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gastos Totales
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              -{transactions.filter((t) => t.type === "expense").length}{" "}
              transacciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <DollarSign
              className={`h-4 w-4 ${
                balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(balance)}
            </div>
            <p className="text-xs text-muted-foreground">
              {balance >= 0 ? "Saldo positivo" : "Saldo negativo"}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Summary;
