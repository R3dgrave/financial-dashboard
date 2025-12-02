export interface FormData {
  type: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export type FormErrors = Partial<Record<keyof FormData, string>>;