const server = "http://localhost:8080";

const token = {
  get(): string | null {
    return localStorage.getItem("token");
  },
  set(value: string) {
    localStorage.setItem("token", value);
  },
  clear() {
    localStorage.removeItem("token");
  },
};
export { server, token };
