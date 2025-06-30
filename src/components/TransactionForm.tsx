import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/data/categories";
import Transaction from "@/interface/Transaction";
import { useTransactionForm } from "@/hooks/useTransactionForm";
import { NumericFormat } from "react-number-format";

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void;
}

const TransactionForm = ({ onAddTransaction }: TransactionFormProps) => {
  const { formData, errors, handleSubmit, updateField } =
    useTransactionForm(onAddTransaction);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Agregar Transacción</CardTitle>
          <CardDescription>Registra un nuevo ingreso o gasto</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select
                  value={formData.type}
                  name="type"
                  onValueChange={(value) => updateField("type", value)}
                >
                  <SelectTrigger
                    className={errors.type ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">💰 Ingreso</SelectItem>
                    <SelectItem value="expense">🧾 Gasto</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => updateField("category", value)}
                  disabled={!formData.type}
                >
                  <SelectTrigger
                    className={errors.category ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {(formData.type === "income"
                      ? INCOME_CATEGORIES
                      : EXPENSE_CATEGORIES
                    ).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Monto (CLP) *</Label>
                <NumericFormat
                  id="amount"
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="$ "
                  allowNegative={false}
                  placeholder="$ 0"
                  value={formData.amount}
                  onValueChange={(values) =>
                    updateField("amount", values.floatValue ?? "")
                  }
                  customInput={Input}
                  className={errors.amount ? "border-red-500" : ""}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Fecha *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField("date", e.target.value)}
                  className={errors.date ? "border-red-500" : ""}
                />
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Input
                id="description"
                placeholder="Descripción de la transacción"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Transacción
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default TransactionForm;
