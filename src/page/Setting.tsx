import { Button, Divider, Input, Textarea } from "react-daisyui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setting } from "../api/setting";
import { OpenAPPConfig } from "../types/config";
import logo from "/logo.png";
import { token } from "../storage";
import { useAuth } from "../component/AuthProvider";

interface State {
  openappConfig: OpenAPPConfig;
  loading: boolean;
  error: string | null;
}

export default function SettingPage() {
  const [state, setState] = useState<State>({
    loading: true,
    error: null,
    openappConfig: {
      username: "",
      password: "",
      registry: "",
    },
  });

  useEffect(() => {
    async function fetchData() {
      const { success, message, data } = await setting.getSetting();
      if (!success) {
        setState({ ...state, loading: false, error: message });
        return;
      }
      setState({
        openappConfig: data ?? state.openappConfig,
        loading: false,
        error: null,
      });
    }
    fetchData();
  }, []);

  useEffect(() => {
    // TODO: send notification
  }, [state.error]);

  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setState({
      ...state,
      openappConfig: {
        ...state.openappConfig,
        [name]: value,
      },
    });
  }

  async function handleFormSubmit() {
    const openappConfig = state.openappConfig;
    const resp = await setting.updateSetting(openappConfig);
    if (!resp.success) {
      setState({ ...state, error: resp.message });
      return;
    }
  }

  const navigate = useNavigate();
  const auth = useAuth();
  function handleLogout() {
    auth.signout(() => {
      token.clear();
      navigate("/login");
    });
  }

  return (
    <div className="flex flex-col mt-8">
      <div className="flex space-x-1">
        <span className="text-gray-500">
          <span>OpenAPP Setting</span>
        </span>
      </div>
      <Divider />
      <div className="flex flex-col p-4 space-y-4 w-full justify-center">
        <div className="flex md:space-x-4 md:flex-row flex-col space-y-2 justify-center">
          <div className="flex-none w-24 h-24 rounded-md p-2 flex items-center justify-center">
            <img src={logo} />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex flex-col p-2 space-y-2 mt-10 justify-center">
            <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2 justify-center">
              <label className="sm:min-w-32">User Name</label>
              <Input
                name="username"
                size="md"
                className="w-full focus:outline-blue-500"
                type="text"
                value={state.openappConfig.username}
                onChange={handleFormChange}
              />
            </div>
            <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
              <label className="sm:min-w-32">User Password</label>
              <Input
                name="password"
                size="md"
                className="w-full focus:outline-blue-500"
                type="password"
                value={state.openappConfig.password}
                onChange={handleFormChange}
              />
            </div>
            <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
              <label className="sm:min-w-32">Registry</label>
              <Textarea
                name="registry"
                className="w-full focus:outline-blue-500"
                rows={6}
                value={state.openappConfig.registry}
                onChange={handleFormChange}
              />
            </div>
            <div className="flex justify-center mt-20 space-x-10">
              <Button
                wide
                className="rounded-xl -mb-10 border-blue-500 color-white text-blue-500 bg-white hover:bg-blue-200 "
                onClick={handleLogout}
              >
                Sign Out
              </Button>
              <Button
                wide
                className="rounded-xl -mb-10 border-none color-white text-white bg-sky-600 hover:bg-sky-700"
                onClick={handleFormSubmit}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
