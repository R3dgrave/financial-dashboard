// src/components/FormFieldSelect.tsx (Nueva Abstracción)
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption {
  value: string;
  label: string;
  key?: string;
}

interface FormFieldSelectProps {
  id: string;
  label: string;
  value: string | undefined;
  options: SelectOption[];
  error?: string;
  placeholder: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
}

export const FormFieldSelect = ({
  id,
  label,
  value,
  options,
  error,
  placeholder,
  disabled,
  onValueChange,
}: FormFieldSelectProps) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={error ? "border-red-500" : ""}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.key || option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);
