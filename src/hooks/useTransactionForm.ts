import { useState } from "react";
import Transaction from "@/interface/Transaction";

interface FormData {
  type: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

export function useTransactionForm(
  onSubmit: (transaction: Omit<Transaction, "id">) => void
) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    type: "",
    category: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const validateForm = (): boolean => {
    const { type, category, amount, date } = formData;
    const newErrors: FormErrors = {};

    if (!type) newErrors.type = "El tipo es obligatorio";
    if (!category) newErrors.category = "La categoría es obligatoria";
    if (!amount || amount <= 0)
      newErrors.amount = "El monto debe ser mayor a $0";
    if (amount > 999_999_999)
      newErrors.amount = "El monto no puede exceder $999.999.999";
    if (!date) newErrors.date = "La fecha es obligatoria";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { type, category, amount, date, description } = formData;
    onSubmit({
      type: type as "income" | "expense",
      category,
      amount,
      date,
      description: description || undefined,
    });

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: "",
      category: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
    setErrors({});
  };

  const updateField = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return {
    formData,
    errors,
    handleSubmit,
    updateField,
    resetForm,
  };
}
