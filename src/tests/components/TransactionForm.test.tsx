import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import TransactionForm from "../../components/TransactionForm";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "../../data/categories";
import { useTransactionForm } from "../../hooks/useTransactionForm";

vi.mock("../../data/categories", () => ({
  INCOME_CATEGORIES: ["Salario", "Inversión"],
  EXPENSE_CATEGORIES: ["Renta", "Comida"],
}));

const mockFormData = {
  type: "income",
  category: "Salary",
  amount: 500,
  date: "2025-12-01",
  description: "",
};

const mockErrors = {};
const mockUpdateField = vi.fn();
const mockHandleSubmit = vi.fn((e: { preventDefault: () => void }) =>
  e.preventDefault()
);

vi.mock("../../hooks/useTransactionForm", () => ({
  useTransactionForm: vi.fn(() => ({
    formData: mockFormData,
    errors: mockErrors,
    handleSubmit: mockHandleSubmit,
    updateField: mockUpdateField,
  })),
}));

vi.mock("../../components/FormFieldSelect", () => ({
  FormFieldSelect: vi.fn(({ id, value, options, onValueChange, disabled }) => (
    <select
      data-testid={`select-${id}`}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      disabled={disabled}
    >
      {options.map((opt: { value: string; label: string }) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )),
}));

vi.mock("../../components/FormFieldInput", () => ({
  FormFieldInput: vi.fn(({ id, value, onValueChange }) => (
    <input
      data-testid={`input-${id}`}
      id={id}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    />
  )),
}));

// Pruebas
describe("TransactionForm", () => {
  const mockOnAddTransaction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTransactionForm).mockReturnValue({
      formData: mockFormData,
      errors: mockErrors,
      handleSubmit: mockHandleSubmit,
      updateField: mockUpdateField,
      resetForm: vi.fn(),
    });
  });

  test("1. Debe renderizar todos los campos y el título (usando una consulta específica)", () => {
    render(<TransactionForm onAddTransaction={mockOnAddTransaction} />);
    expect(
      screen.getByText("Agregar Transacción", {
        selector: 'div[data-slot="card-title"]',
      })
    ).toBeInTheDocument();
    expect(screen.getByTestId("select-type")).toBeInTheDocument();
    expect(screen.getByTestId("select-category")).toBeInTheDocument();
    expect(screen.getByTestId("input-amount")).toBeInTheDocument();
    expect(screen.getByTestId("input-date")).toBeInTheDocument();
    expect(screen.getByTestId("input-description")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Agregar Transacción/i })
    ).toBeInTheDocument();
  });

  test("2. Debe llamar a updateField con los valores correctos (tipo de dato corregido)", () => {
    render(<TransactionForm onAddTransaction={mockOnAddTransaction} />);
    const amountInput = screen.getByTestId("input-amount");
    fireEvent.change(amountInput, { target: { value: "750" } });
    expect(mockUpdateField).toHaveBeenCalledWith("amount", "750");
    const typeSelect = screen.getByTestId("select-type");
    fireEvent.change(typeSelect, { target: { value: "expense" } });
    expect(mockUpdateField).toHaveBeenCalledWith("type", "expense");
  });

  test("3. Debe cambiar las categorías de 'expense' a 'income' y viceversa", () => {
    const { rerender } = render(
      <TransactionForm onAddTransaction={mockOnAddTransaction} />
    );
    let categorySelect = screen.getByTestId("select-category");
    expect(categorySelect).toHaveTextContent(INCOME_CATEGORIES[0]);
    expect(categorySelect).not.toHaveTextContent(EXPENSE_CATEGORIES[0]);
    vi.mocked(useTransactionForm).mockReturnValue({
      ...vi.mocked(useTransactionForm).mock.results[0].value,
      formData: { ...mockFormData, type: "expense" },
    });
    rerender(<TransactionForm onAddTransaction={mockOnAddTransaction} />);
    categorySelect = screen.getByTestId("select-category");
    expect(categorySelect).toHaveTextContent(EXPENSE_CATEGORIES[0]);
    expect(categorySelect).not.toHaveTextContent(INCOME_CATEGORIES[0]);
  });

  test("4. Debe llamar a handleSubmit cuando se envía el formulario (consulta corregida)", () => {
    render(<TransactionForm onAddTransaction={mockOnAddTransaction} />);
    const submitButton = screen.getByRole("button", {
      name: /Agregar Transacción/i,
    });
    fireEvent.click(submitButton);
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });
});
