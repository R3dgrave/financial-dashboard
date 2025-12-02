import { FormData, FormErrors } from "../types/FormData";

export class TransactionValidator {
  public static validate(formData: FormData): FormErrors {
    const { type, category, amount, date } = formData;
    const errors: FormErrors = {};

    if (!type) errors.type = "El tipo es obligatorio";
    if (!category) errors.category = "La categoría es obligatoria";
    
    if (!amount || amount <= 0) {
      errors.amount = "El monto debe ser mayor a $0";
    } else if (amount > 999_999_999) {
      errors.amount = "El monto no puede exceder $999.999.999";
    }

    if (!date) errors.date = "La fecha es obligatoria";

    return errors;
  }
}