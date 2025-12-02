import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/data/categories";
import Transaction from "@/types/Transaction";
import { useTransactionForm } from "@/hooks/useTransactionForm";
import { FormFieldSelect } from "./FormFieldSelect";
import { FormFieldInput } from "./FormFieldInput";

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void;
}

const TransactionForm = ({ onAddTransaction }: TransactionFormProps) => {
  const { formData, errors, handleSubmit, updateField } =
    useTransactionForm(onAddTransaction);

  // Lógica Presentación para Categorías
  const currentCategories = (
    formData.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  ).map((cat) => ({ value: cat, label: cat }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Transacción</CardTitle>
        <CardDescription>Registra un nuevo ingreso o gasto</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Campo 1: Tipo de Transacción (Select) */}
            <FormFieldSelect
              id="type"
              label="Tipo *"
              value={formData.type}
              options={[
                { value: "income", label: "💰 Ingreso" },
                { value: "expense", label: "🧾 Gasto" },
              ]}
              error={errors.type}
              placeholder="Seleccionar tipo"
              onValueChange={(value) => updateField("type", value)}
            />

            {/* Campo 2: Categoría (Select) */}
            <FormFieldSelect
              id="category"
              label="Categoría *"
              value={formData.category}
              options={currentCategories}
              error={errors.category}
              placeholder="Seleccionar categoría"
              disabled={!formData.type}
              onValueChange={(value) => updateField("category", value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Campo 3: Monto (Numeric Input) */}
            <FormFieldInput
              id="amount"
              label="Monto (CLP) *"
              type="number"
              value={formData.amount}
              error={errors.amount}
              placeholder="$ 0"
              onValueChange={(value: string | number) =>
                updateField("amount", value)
              }
            />

            {/* Campo 4: Fecha (Date Input) */}
            <FormFieldInput
              id="date"
              label="Fecha *"
              type="date"
              value={formData.date}
              error={errors.date}
              onValueChange={(value) => updateField("date", value)}
            />
          </div>

          {/* Campo 5: Descripción (Text Input) */}
          <FormFieldInput
            id="description"
            label="Descripción (opcional)"
            type="text"
            value={formData.description}
            placeholder="Descripción de la transacción"
            onValueChange={(value) => updateField("description", value)}
          />

          <Button type="submit" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Transacción
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
