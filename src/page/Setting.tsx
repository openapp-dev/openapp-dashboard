import { Button, Divider, Input, Textarea } from "react-daisyui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setting } from "../api/setting";
import { OpenAPPConfig } from "../types/config";
import logo from "/logo.png";
import { token } from "../storage";
import { useAuth } from "../component/AuthProvider";

interface State {
  openappConfig?: OpenAPPConfig;
  loading: boolean;
  error: string | null;
}

export default function SettingPage() {
  const [state, setState] = useState<State>({
    loading: true,
    error: null,
  });
  const [userName, setUserName] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");
  const [registries, setRegistries] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      const { success, message, data } = await setting.getSetting();
      if (!success) {
        setState({ ...state, loading: false, error: message });
        return;
      }
      setState({
        openappConfig: data ?? undefined,
        loading: false,
        error: null,
      });
    }
    setUserName(state.openappConfig?.username?? "");
    setUserPassword(state.openappConfig?.password?? "");
    setRegistries(state.openappConfig?.registry?? "");
    fetchData();
  }, []);

  useEffect(() => {
    // TODO: send notification
  }, [state.error]);

  const navigate = useNavigate();
  const auth = useAuth();
  function handleLogout() {
    auth.signout(() => {
      token.clear();
      navigate("/login");
    });
  }

  return (
    <div className="flex flex-col">
      <div className="flex space-x-1">
        <span className="text-gray-500">
          <span>OpenAPP Setting</span>
        </span>
      </div>
      <Divider />
      <div className="flex flex-col p-4 space-y-4 w-3/4 justify-center">
        <div className="flex md:space-x-4 md:flex-row flex-col space-y-2 justify-center">
          <div className="flex-none w-24 h-24 rounded-md p-2 flex items-center justify-center">
            <img src={logo} />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex flex-col p-2 space-y-2 mt-10 justify-center">
            <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2 justify-center">
              <label className="sm:min-w-32">User Name</label>
              <input
                type="text"
                id="name-input"
                className="block w-full p-2 text-gray-400 border border-gray-300 rounded-lg bg-white text-base focus:ring-blue-500 focus:border-blue-500"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
              <label className="sm:min-w-32">User Password</label>
              <input
                type="text"
                id="password-input"
                className="block w-full p-2 text-gray-400 border border-gray-300 rounded-lg bg-white text-base focus:ring-blue-500 focus:border-blue-500"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
              <label className="sm:min-w-32">Registry</label>
              <textarea
                id="registries"
                rows={6}
                className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Input your custom registries..."
                value={registries}
                onChange={(e) => setRegistries(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <Button
                wide
                className="rounded-xl -mb-10 border-blue-500 color-white text-blue-500 bg-white hover:bg-blue-200 mr-10 mt-20"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
              <Button
                wide
                className="rounded-xl -mb-10 border-none color-white text-white bg-sky-600 hover:bg-sky-700 ml-10 mt-20"
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
