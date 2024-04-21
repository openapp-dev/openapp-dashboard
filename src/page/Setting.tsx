import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Divider, Input, Textarea } from "react-daisyui";
import { CheckIcon, EyeIcon } from "@heroicons/react/24/outline";
import { setting } from "../api";
import { OpenAPPConfig } from "../types";
import { token } from "../storage";
import { useAuth } from "../component/AuthProvider";
import logo from "/logo.png";
import { OpenAppDialog } from "../component/OpenAppDialog";

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

  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  async function handleFormSubmit() {
    const openappConfig = state.openappConfig;
    const resp = await setting.updateSetting(openappConfig);
    if (!resp.success) {
      setState({ ...state, error: resp.message });
      return;
    }
    setOpen(true);
  }

  const navigate = useNavigate();
  const auth = useAuth();
  function handleLogout() {
    auth.signout(() => {
      token.clear();
      navigate("/login");
    });
  }

  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col mt-8">
      <OpenAppDialog
          initialFocus={cancelButtonRef}
          show={open}
          onClose={(value) =>
            setOpen(value)
          }
          title={"Setting Updated"}
          content={"The OpenAPP setting has been successfully updated and will take effect in a few seconds."}
          confirm={
            <Button
              ref={cancelButtonRef}
              color="primary"
              size="sm"
              onClick={() =>
                setOpen(false)
              }
            >
              OK
            </Button>
          }
          cancel={<></>}
          icon={
            <CheckIcon
              className="h-6 w-6 text-blue-600"
              aria-hidden="true"
            />
          }
        />
      <div className="flex space-x-1">
        <span className="text-gray-500">
          <span>OpenAPP Setting</span>
        </span>
      </div>
      <Divider />
      <div className="flex flex-col p-4 space-y-4 w-full justify-center items-center">
        <div className="flex-none md:space-x-4 space-y-2 justify-center w-full items-center">
          <div className="w-full rounded-md p-2 justify-center items-center">
            <img className="w-24 h-24 object-center mx-auto" src={logo} />
          </div>
          <em className="text-neutral-500 w-full flex justify-center">
            An integrated application management platform for NAS/Linux.
          </em>
        </div>
        <div className="flex flex-col justify-center w-7/12">
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
              <div className="relative w-full">
                <Input
                  name="password"
                  size="md"
                  className="w-full focus:outline-blue-500"
                  type={showPassword ? "text" : "password"}
                  value={state.openappConfig.password}
                  onChange={handleFormChange}
                />
                <div className="absolute inset-y-0 right-3 flex items-center ps-3 cursor-pointer">
                  <EyeIcon
                    className="w-6 h-6 text-gray-400 hover:text-sky-600"
                    onMouseDown={() => setShowPassword(true)}
                    onMouseUp={() => setShowPassword(false)}
                  />
                </div>
              </div>
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
            <div className="flex justify-center pt-20 space-x-10">
              <Button
                wide
                className="rounded-xl w-40 border-blue-500 color-white text-blue-500 bg-white hover:bg-blue-200 "
                onClick={handleLogout}
              >
                Sign Out
              </Button>
              <Button
                wide
                className="rounded-xl w-40 border-none color-white text-white bg-sky-600 hover:bg-sky-700"
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
