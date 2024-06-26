import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Input, Link } from "react-daisyui";
import { token } from "../storage";
import { login } from "../api";
import { useAuth } from "../component/AuthProvider";
import logo from "/logo.png";

interface State {
  username: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/");
    }
  }, []);

  const [state, setState] = useState<State>({
    username: "",
    password: "",
  });

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setState((prev) => ({ ...prev, [name]: value }));
  }

  async function handleLogin() {
    const { username, password } = state;
    const resp = await login(username, password);
    if (!resp.success) {
      setShowLoginError(true);
      return;
    }
    const respToken = resp.data?.token;
    if (!respToken) {
      return;
    }
    auth.signin(() => {
      token.set(respToken);
      navigate("/");
    });
  }

  const [showLoginError, setShowLoginError] = useState<boolean>(false);

  return (
    <div className="h-screen flex items-center lg:justify-end justify-center bg-cover bg-login">
      <div className="flex flex-col w-96 rounded-lg space-y-8 px-4 py-4 lg:mr-48 bg-white">
        <div className="flex justify-between mt-4 text-lg items-center">
          <span color="black">Login</span>
          <Avatar src={logo} size="sm" shape="square" />
        </div>
        <div className="flex flex-col space-y-2 ">
          {showLoginError ? (
            <div className="w-full flex items-center justify-center">
              <span className="w-full text-red-600 bg-gray-100 pt-2 pb-2 rounded-md mb-3 text-center">
                Incorrect user name or password
              </span>
            </div>
          ) : null}
          <Input
            name="username"
            type="text"
            placeholder="username"
            className="appearance-none bg-transparent rounded-none border-x-0 border-t-0 border-b-2 w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            value={state.username}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
          />
          <span />
          <Input
            name="password"
            type="password"
            placeholder="password"
            className="appearance-none bg-transparent rounded-none border-x-0 border-t-0 border-b-2 w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            value={state.password}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
          />
          <span />
          <Link color="accent">Forget Password?</Link>
        </div>
        <div className=" flex justify-center ">
          <Button
            wide
            className="rounded-3xl -mb-10  border-none color-white text-white bg-sky-600 hover:bg-sky-700"
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
