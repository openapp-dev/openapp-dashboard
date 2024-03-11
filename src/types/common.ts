interface Response<T> {
  success: boolean;
  message: string;
  data?: T;
}

interface Request<T> {
  method: "GET" | "POST" | "DELETE";
  path: string;
  data?: T;
}

interface DerivedResource {
  apiVersion: string;
  kind: string;
  name: string;
}

export type { Response, Request, DerivedResource };
