interface InputField {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Inputs {
  [key: string]: InputField;
}

export type { InputField, Inputs };
