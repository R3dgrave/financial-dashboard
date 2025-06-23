import { ExpenseChart } from "../components/ExpenseChart";
import Header from "../components/Header";
import TransactionForm from "../components/TransactionForm";
import { useTransactions } from "@/hooks/useTransaction";
import { useFinancialSummary } from "@/hooks/useFinancialSummary";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingDown, TrendingUp, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AmountDisplay } from "@/components/AmountDisplay";

const FinancialDashboard = () => {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    formatCurrency,
    formatDate,
  } = useTransactions();
  const {
    totalIncome,
    totalExpenses,
    balance,
    incomeCount,
    expenseCount,
    expensesByCategory,
  } = useFinancialSummary(transactions);
  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <Header />

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
                  +{incomeCount} transacciones
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
                  -{expenseCount} transacciones
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TransactionForm onAddTransaction={addTransaction} />
            <ExpenseChart expensesByCategory={expensesByCategory} />
          </div>

          {/* Lista de Transacciones */}
          <Card>
            <CardHeader>
              <CardTitle>Últimas Transacciones</CardTitle>
              <CardDescription>
                Historial de tus movimientos financieros
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.type === "income"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.type === "income"
                              ? "💰 Ingreso"
                              : "🧾 Gasto"}
                          </span>
                        </TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell>{transaction.description || "-"}</TableCell>

                        <TableCell className="text-right">
                          <AmountDisplay
                            amount={transaction.amount}
                            type={transaction.type}
                            showSign={true}
                          />
                        </TableCell>

                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTransaction(transaction.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay transacciones registradas</p>
                  <p className="text-sm">
                    Comienza agregando tu primera transacción
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default FinancialDashboard;
