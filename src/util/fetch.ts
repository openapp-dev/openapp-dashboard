import { Response, Request } from "../types/common";
import { token } from "../storage";

async function request<T, R>(request: Request<T>): Promise<Response<R>> {
  const authToken = token.get();
  const response = await fetch(request.path, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `${authToken}`,
    },
    body: JSON.stringify(request.data),
  });
  if (!response.ok) {
    return {
      success: false,
      message: response.statusText,
    };
  }
  const { code, message, data } = await response.json();
  return {
    success: code === 200,
    message: message,
    data: data,
  };
}

async function get<T>(path: string): Promise<Response<T>> {
  return request({ method: "GET", path });
}

async function post<T, R>(path: string, data?: T): Promise<Response<R>> {
  return request({ method: "POST", path, data });
}

async function del<T>(path: string): Promise<Response<T>> {
  return request({ method: "DELETE", path });
}

export const requests = {
  get,
  post,
  del,
};
