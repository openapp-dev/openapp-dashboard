interface InputField {
  type: "string" | "number" | "boolean" | "array" | "object";
  required: boolean;
  description: string;
  default?: string | number | boolean;
  items?: {
    type: "string" | "number" | "boolean" | "array" | "object";
    properties?: Record<string, InputField>;
  };
  properties?: Record<string, InputField>;
}

export type { InputField };
