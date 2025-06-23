import { useState } from "react";
import Transaction from "@/interface/Transaction";
import { useTransactions } from "./useTransaction";

interface FormData {
  type: string;
  category: string;
  amount: string;
  date: string;
  description: string;
}

export function useTransactionForm(
  onSubmit: (transaction: Omit<Transaction, "id">) => void
) {
  const [formData, setFormData] = useState<FormData>({
    type: "",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const { formatCurrencyInput, parseCurrencyInput } = useTransactions();
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.type) newErrors.type = "El tipo es obligatorio";
    if (!formData.category) newErrors.category = "La categoría es obligatoria";

    const numericAmount = parseCurrencyInput(formData.amount);
    if (!formData.amount || numericAmount <= 0) {
      newErrors.amount = "El monto debe ser mayor a $0";
    }
    if (numericAmount > 999999999) {
      newErrors.amount = "El monto no puede exceder $999.999.999";
    }

    if (!formData.date) newErrors.date = "La fecha es obligatoria";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const transaction: Omit<Transaction, "id"> = {
      type: formData.type as "income" | "expense",
      category: formData.category,
      amount: parseCurrencyInput(formData.amount),
      date: formData.date,
      description: formData.description || undefined,
    };

    onSubmit(transaction);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: "",
      category: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
    setErrors({});
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const updateAmountField = (value: string) => {
    const formattedValue = formatCurrencyInput(value);
    setFormData((prev) => ({ ...prev, amount: formattedValue }));

    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  return {
    formData,
    errors,
    handleSubmit,
    updateField,
    updateAmountField,
    resetForm,
  };
}
