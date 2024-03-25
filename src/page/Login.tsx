import { Avatar, Button, Input, Link } from "react-daisyui";
import { useAuth } from "../component/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../api/login";
import { token } from "../storage";

interface State {
  username: string;
  password: string;
}

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [state, setState] = useState<State>({
    username: "",
    password: "",
  });

  function handleInputChange(key: string, value: string) {
    setState({ ...state, [key]: value });
  }

  async function handleLogin() {
    const { username, password } = state;
    const resp = await login(username, password);
    if (!resp.success) {
      return;
    }
    if (!resp.data?.token) {
      return;
    }
    auth.signin(state.username, () => {
      token.set(resp.data?.token as string);
      navigate("/");
    });
  }

  return (
    <div className="h-screen flex items-center lg:justify-end justify-center">
      <div className="flex flex-col w-96 rounded-lg border space-y-2 px-4 py-2 lg:mr-48">
        <div className="flex justify-between mt-4 text-lg items-center">
          <span>Login</span>
          <Avatar
            src="https://picsum.photos/200/200"
            size="sm"
            shape="circle"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Input
            type="text"
            placeholder="username"
            className="rounded-none border-x-0 border-t-0 border-b-2 focus:border-x-0 focus:border-t-0"
            value={state.username}
            onChange={(e) => {
              handleInputChange("username", e.target.value);
            }}
          />
          <Input
            type="password"
            placeholder="password"
            className="rounded-none border-x-0 border-t-0 border-b-2"
            value={state.password}
            onChange={(e) => {
              handleInputChange("password", e.target.value);
            }}
          />
          <Link>Forget Password?</Link>
        </div>
        <div className=" flex justify-center">
          <Button
            color="primary"
            wide
            className="rounded-3xl -mb-8"
            onClick={handleLogin}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
