import { TransactionValidator } from '../../services/TransactionValidator';
import { FormData } from '../../types/FormData';

describe('TransactionValidator', () => {
  const validFormData: FormData = {
    type: 'income',
    category: 'Sueldo',
    amount: 1000,
    date: '2025-11-28',
    description: 'Descripción válida',
  };

  test('debe retornar un objeto vacío para un formulario válido', () => {
    const errors = TransactionValidator.validate(validFormData);
    expect(errors).toEqual({});
  });

  // PRUEBAS:
  test('debe fallar si el campo tipo está vacío', () => {
    const errors = TransactionValidator.validate({ ...validFormData, type: '' });
    expect(errors.type).toBe('El tipo es obligatorio');
  });

  test('debe fallar si el monto es cero o negativo', () => {
    let errors = TransactionValidator.validate({ ...validFormData, amount: 0 });
    expect(errors.amount).toBe('El monto debe ser mayor a $0');

    errors = TransactionValidator.validate({ ...validFormData, amount: -100 });
    expect(errors.amount).toBe('El monto debe ser mayor a $0');
  });

  test('debe fallar si el monto excede el límite (999.999.999)', () => {
    const errors = TransactionValidator.validate({ ...validFormData, amount: 1_000_000_000 });
    expect(errors.amount).toBe('El monto no puede exceder $999.999.999');
  });

  test('debe fallar si la categoría está vacía', () => {
    const errors = TransactionValidator.validate({ ...validFormData, category: '' });
    expect(errors.category).toBe('La categoría es obligatoria');
  });
  
  test('debe fallar si la fecha está vacía', () => {
    const errors = TransactionValidator.validate({ ...validFormData, date: '' });
    expect(errors.date).toBe('La fecha es obligatoria');
  });

  test('debe retornar múltiples errores si hay varios fallos', () => {
    const errors = TransactionValidator.validate({
      ...validFormData,
      type: '',
      amount: -50,
      category: '',
    });
    expect(Object.keys(errors).length).toBe(3);
    expect(errors.type).toBeDefined();
    expect(errors.amount).toBeDefined();
    expect(errors.category).toBeDefined();
  });
});