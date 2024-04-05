interface InputField {
  type: "string" | "integer" | "boolean" | "array" | "object";
  required: boolean;
  description: string;
  default?: string | number | boolean;
  items?: {
    type: "string" | "integer" | "boolean" | "array" | "object";
    properties?: Record<string, InputField>;
  };
  properties?: Record<string, InputField>;
}

export type { InputField };
