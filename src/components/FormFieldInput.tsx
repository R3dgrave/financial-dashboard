import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { HTMLAttributes } from "react";
import { NumericFormat } from "react-number-format";

interface FormFieldInputProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  label: string;
  type: "text" | "number" | "date";
  value: string | number;
  error?: string;
  placeholder?: string;
  onValueChange: (value: string | number) => void;
}

export const FormFieldInput = ({
  id,
  label,
  type,
  value,
  error,
  placeholder,
  onValueChange,
  ...props
}: FormFieldInputProps) => {
  const inputClass = error ? "border-red-500" : "";

  const renderInput = () => {
    if (type === "number") {
      return (
        <NumericFormat
          id={id}
          thousandSeparator="."
          decimalSeparator=","
          prefix="$ "
          allowNegative={false}
          placeholder={placeholder}
          value={value}
          onValueChange={(values) => onValueChange(values.floatValue ?? "")}
          customInput={Input}
          className={inputClass}
        />
      );
    }

    return (
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={inputClass}
      />
    );
  };

  return (
    <div className="space-y-2" {...props}>
      <Label htmlFor={id}>{label}</Label>
      {renderInput()}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
