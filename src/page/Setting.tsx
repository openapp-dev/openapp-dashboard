import { Button, Divider, Input, Textarea } from "react-daisyui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setting } from "../api/setting";
import { OpenAPPConfig } from "../types/config";
import logo from "/logo.png";
import { token } from "../storage";

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
    fetchData();
  }, []);

  useEffect(() => {
    // TODO: send notification
  }, [state.error]);

  const navigate = useNavigate();
  function handleLogout() {
    token.clear();
    navigate("/login");
  }

  return (
    <div className="flex flex-col">
      <div className="flex space-x-1">
        <span className="text-gray-500">
          <span>OpenAPP Configuration</span>
        </span>
      </div>
      <Divider />
      <div className="flex flex-col p-4 space-y-4">
        <div className="flex md:space-x-4 md:flex-row flex-col space-y-2 justify-center">
          <div className="flex-none w-24 h-24 rounded-md p-2 flex items-center justify-center">
            <img src={logo} />
          </div>
        </div>
        <div className="flex flex-col border border-gray-300">
          <div className="bg-base-300 px-4 py-2">Configuration</div>
          <div className="flex flex-col p-2 space-y-2">
            {/* Following are the build-in necessary params */}
            <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
              <label className="sm:min-w-64">Registry</label>
              <Textarea
                className="sm:w-96 w-full"
                placeholder="Registry"
                value={state.openappConfig?.registry}
                size="lg"
              />
            </div>
            <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
              <label className="sm:min-w-64">Admin name</label>
              <Input
                className="sm:w-96 w-full"
                placeholder="Registry"
                value={state.openappConfig?.userName}
              />
            </div>
            <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
              <label className="sm:min-w-64">Admin password</label>
              <Input
                className="sm:w-96 w-full"
                placeholder="Registry"
                value={state.openappConfig?.password}
              />
            </div>
            <div className="justify-center ">
              <Button
                wide
                className="rounded-3xl -mb-10 bg-sky-400 border-none color-white text-white bg-sky-600 hover:bg-sky-700"
                onClick={handleLogout}
                >
                  Sign Out
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
