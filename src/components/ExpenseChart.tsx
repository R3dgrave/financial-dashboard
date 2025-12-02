import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { CHART_COLORS } from "@/data/categories";

interface ExpenseChartProps {
  expensesByCategory: Record<string, number>;
}

export const ExpenseChart = ({ expensesByCategory }: ExpenseChartProps) => {
  const chartData = Object.entries(expensesByCategory).map(
    ([category, amount], index) => ({
      category,
      amount,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    })
  );

  const totalExpenses = Object.values(expensesByCategory).reduce(
    (sum, amount) => sum + amount,
    0
  );

  return (
    <>
      <Card data-testid="mock-expense-chart">
        <CardHeader>
          <CardTitle>Gastos por Categoría</CardTitle>
          <CardDescription>Distribución de tus gastos</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ChartContainer 
              config={{}}
              className="flex w-full h-[300px] overflow-x-auto"
            >

                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, amount }) =>
                      `${category} ${((amount / totalExpenses) * 100).toFixed(
                        0
                      )}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p>No hay gastos registrados</p>
                <p className="text-sm">
                  Agrega algunas transacciones para ver el gráfico
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
