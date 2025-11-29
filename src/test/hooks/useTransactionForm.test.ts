import { renderHook, act } from "@testing-library/react";
import { useTransactionForm } from "../../hooks/useTransactionForm";
import { TransactionValidator } from "../../services/TransactionValidator";

jest.mock("../../services/TransactionValidator", () => ({
  TransactionValidator: {
    validate: jest.fn(),
  },
}));

const mockValidator = TransactionValidator.validate as jest.Mock;

describe("useTransactionForm", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("updateField debe actualizar formData y limpiar errores del campo específico", () => {
    const { result } = renderHook(() => useTransactionForm(mockOnSubmit));

    act(() => {
      result.current.errors.type = "El tipo es obligatorio";
      result.current.updateField("type", "income");
    });

    expect(result.current.formData.type).toBe("income");
    expect(result.current.errors.type).toBeUndefined();
  });

  test("handleSubmit debe llamar a onSubmit y resetear el formulario si la validación pasa", () => {
    mockValidator.mockReturnValue({});

    const { result } = renderHook(() => useTransactionForm(mockOnSubmit));

    act(() => {
      result.current.updateField("type", "expense");
      result.current.updateField("category", "Test");
      result.current.updateField("amount", 500);
      result.current.updateField("description", "Test desc");
    });

    const dataToSend = { ...result.current.formData };

    act(() => {
      result.current.handleSubmit({
        preventDefault: () => {},
      } as React.FormEvent);
    });

    expect(mockValidator).toHaveBeenCalledWith(dataToSend);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "expense",
        amount: 500,
        description: "Test desc",
      })
    );

    expect(result.current.formData.amount).toBe(0);
    expect(result.current.formData.date).not.toBe(dataToSend);
  });

  test("handleSubmit NO debe llamar a onSubmit si la validación falla", () => {
    mockValidator.mockReturnValue({ type: "error" });
    const { result } = renderHook(() => useTransactionForm(mockOnSubmit));

    act(() => {
      result.current.handleSubmit({
        preventDefault: () => {},
      } as React.FormEvent);
    });

    expect(mockValidator).toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.type).toBe("error");
  });
});
