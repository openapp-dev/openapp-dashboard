const server = "http://172.16.1.6:61003";

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
