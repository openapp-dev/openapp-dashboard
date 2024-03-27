import { Button, Divider, Input, Textarea } from "react-daisyui";
import { Fragment, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from '@headlessui/react'
import { DocumentCheckIcon } from '@heroicons/react/24/outline'
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

  return (
    <div className="flex flex-col mt-8">
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <DocumentCheckIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                          Setting Updated
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            The OpenAPP setting has been successfully updated and will take effect in a few seconds.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="bg-sky-600 hover:bg-sky-700 mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ring-none sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      OK
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
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
          <em className="text-neutral-500 w-full flex justify-center">An integrated application management platform for NAS/Linux.</em>
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
