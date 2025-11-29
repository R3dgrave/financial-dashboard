import { useState } from "react";
import Transaction from "@/types/Transaction";
import { FormData, FormErrors } from "../types/FormData";
import { TransactionValidator } from "../services/TransactionValidator";

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
    const newErrors = TransactionValidator.validate(formData);

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
