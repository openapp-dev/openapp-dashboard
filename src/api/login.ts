import { server } from "../storage";
import { requests } from "../util";

async function login(username: string, password: string) {
  return requests.post<
    {
      username: string;
      password: string;
    },
    {
      token: string;
    }
  >(`${server}/login`, {
    username,
    password,
  });
}
export { login };
