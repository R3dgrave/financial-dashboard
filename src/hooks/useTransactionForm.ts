import { useState } from "react";
import Transaction from "@/interface/Transaction";

interface FormData {
  type: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}
interface FormErrors {
  type?: string;
  category?: string;
  amount?: string;
  date?: string;
  description?: string;
}

export function useTransactionForm(
  onSubmit: (transaction: Omit<Transaction, "id">) => void
) {
  //useStates para controlar estados
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    type: "",
    category: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  //Validar campos del formulario
  const validateForm = (): boolean => {
    const newErrors: Partial<FormErrors> = {};

    if (!formData.type) newErrors.type = "El tipo es obligatorio";
    if (!formData.category) newErrors.category = "La categoría es obligatoria";
    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = "El monto debe ser mayor a $0";
    if (formData.amount > 999_999_999) {
      newErrors.amount = "El monto no puede exceder $999.999.999";
    }
    console.log("Monto ingresado:", formData.amount);
    if (!formData.date) newErrors.date = "La fecha es obligatoria";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //enviar formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const transaction: Omit<Transaction, "id"> = {
      type: formData.type as "income" | "expense",
      category: formData.category,
      amount: formData.amount,
      date: formData.date,
      description: formData.description || undefined,
    };

    onSubmit(transaction);
    resetForm();
  };

  //resetear formulario luego del envio
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

  //controlar cambios de estado en los inputs
  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  //actualizar el campo monto
  const updateAmount = (value: number | undefined) => {
    if (typeof value === "number") {
      setFormData((prev) => ({ ...prev, amount: value }));
      if (errors.amount) {
        setErrors((prev) => ({ ...prev, amount: undefined }));
      }
    }
  };

  return {
    formData,
    errors,
    handleSubmit,
    updateField,
    updateAmount,
    resetForm,
  };
}
