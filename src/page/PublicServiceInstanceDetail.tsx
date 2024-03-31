import { Link } from "react-router-dom";
import { AppTemplate, AppInstance, PublicServiceInstance, PublicServiceTemplate } from "../types";
import { useLocation, useNavigate } from "react-router-dom";
import { Divider } from "react-daisyui";
import {
  Cog6ToothIcon,
  RocketLaunchIcon,
  BuildingStorefrontIcon,
  GlobeAltIcon,
  CheckIcon,
  ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Menu, Transition, Dialog } from '@headlessui/react'
import { Fragment, useRef, ReactElement, useEffect, useState } from 'react'

import Panel from "../component/Panel";
import { publicServiceInstance, publicServiceTemplate } from "../api";
import { logs } from "../api/logs"

interface State {
  instance: PublicServiceInstance | null;
  template: PublicServiceTemplate | null;
  loading: boolean;
  error: string | null;
}

interface MenuProps {
  className: string;
}

export default function PublicServiceInstanceDetail() {
  const location = useLocation();
  const instanceName = location.state.name;

  function EditInactiveIcon(props: MenuProps) {
    return (
      <svg
        {...props}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 13V16H7L16 7L13 4L4 13Z"
          fill="#EDE9FE"
          stroke="#A78BFA"
          strokeWidth="2"
        />
      </svg>
    )
  }

  function EditActiveIcon(props: MenuProps) {
    return (
      <svg
        {...props}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 13V16H7L16 7L13 4L4 13Z"
          fill="#8B5CF6"
          stroke="#C4B5FD"
          strokeWidth="2"
        />
      </svg>
    )
  }

  function DeleteInactiveIcon(props: MenuProps) {
    return (
      <svg
        {...props}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="5"
          y="6"
          width="10"
          height="10"
          fill="#EDE9FE"
          stroke="#A78BFA"
          strokeWidth="2"
        />
        <path d="M3 6H17" stroke="#A78BFA" strokeWidth="2" />
        <path d="M8 6V4H12V6" stroke="#A78BFA" strokeWidth="2" />
      </svg>
    )
  }

  function DeleteActiveIcon(props: MenuProps) {
    return (
      <svg
        {...props}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="5"
          y="6"
          width="10"
          height="10"
          fill="#8B5CF6"
          stroke="#C4B5FD"
          strokeWidth="2"
        />
        <path d="M3 6H17" stroke="#C4B5FD" strokeWidth="2" />
        <path d="M8 6V4H12V6" stroke="#C4B5FD" strokeWidth="2" />
      </svg>
    )
  }

  async function handleDeleteInstance() {
    let name = state.instance?.metadata.name ?? "";
    if (name === "") {
      return;
    }
    const resp = await publicServiceInstance.deletePublicServiceInstance(name);
    if (!resp.success) {
      setState({ ...state, error: resp.message });
      return;
    }
    setDeleteResultOpen(true);
  }

  const [state, setState] = useState<State>({
    instance: null,
    template: null,
    loading: true,
    error: null,
  });
  const [log, setLog] = useState<ReactElement[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const instance  =
        await publicServiceInstance.getPublicServiceInstance(instanceName);
      if (!instance.success) {
        setState({ ...state, loading: false, error: instance.message });
        return;
      }
      let templateName =  instance.data?.spec.publicServiceTemplate?? "";
      if (templateName === "") {
        return;
      }
      const template = await publicServiceTemplate.getPublicServiceTemplate(templateName);
      if (!template.success) {
        setState({ ...state, loading: false, error: template.message });
        return;
      }

      setState({
        instance: instance.data ?? null,
        template: template.data ?? null,
        loading: false,
        error: null,
      });

      const logGet = await logs.getPublicServiceInstanceLogs(instanceName);
      if (!logGet.success) {
        setState({ ...state, loading: false, error: logGet.message });
        return;
      }
      let logDetail = (logGet.data ?? "").split('\n').map((line, _) => (
        <Fragment>{line}
          <br />
        </Fragment>
      ));
      setLog(logDetail);
    }
    fetchData();
  }, []);

  useEffect(() => {
    // TODO: send notification
  }, [state.error]);

  const [deleteWaringOpen, setDeleteWaringOpen] = useState(false);
  const [deleteResultOpen, setDeleteResultOpen] = useState(false);
  const cancelButtonRef = useRef(null);

  return (
    <div className="flex flex-col">
      <Transition.Root show={deleteResultOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setDeleteResultOpen}>
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
                        <CheckIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                          APP deleted
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-900">
                            APP has been deleted successfully.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="bg-sky-600 hover:bg-sky-700 mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ring-none sm:mt-0 sm:w-auto"
                      onClick={() => {
                          setDeleteResultOpen(false);
                          navigate("/instance/app");
                        }
                      }
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
      <Transition.Root show={deleteWaringOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setDeleteWaringOpen}>
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
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-700" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-red-700">
                          Waring
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-red-700">
                            Are you sure to delete Public Service {state.instance?.metadata.name}?
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="ml-3 bg-red-500 hover:bg-red-600 mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ring-none sm:mt-0 sm:w-auto"
                      onClick={() => {
                          setDeleteWaringOpen(false);
                          handleDeleteInstance();
                        }
                      }
                      ref={cancelButtonRef}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="bg-sky-600 hover:bg-sky-700 mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ring-none sm:mt-0 sm:w-auto"
                      onClick={() => setDeleteWaringOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancle
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
          <Link to="/instance/app">APP instance</Link>
        </span>
        <span>/</span>
        <span className="font-bold">{state.instance?.metadata.name}</span>
      </div>
      <Divider />
      <div className="flex flex-col p-4 space-y-4">
        <div className="flex md:space-x-4 md:flex-row flex-col space-y-2">
          <div className="flex-none w-24 h-24 rounded-md p-2 border border-gray-300">
            {state.template?.spec.icon === "" ? (
              <span className="font-bold w-full h-full text-5xl flex justify-center items-center">
                {state.template?.spec.title[0].toUpperCase()}
              </span>
            ) : (
              <img
                src={state.template?.spec.icon}
                alt={state.template?.spec.title}
                className="w-full h-full"
              />
            )}
          </div>
          <div className="flex-1 flex-col space-y-1">
            <div className="text-2xl font-bold">{state.instance?.metadata.name}</div>
            <div className="text-sm">Powered by {state.template?.metadata.name}</div>
            <div className="text-sm">{state.template?.spec.description}</div>
          </div>
          <div className="flex-none">
            <Menu as="div" className="inline-block text-left rounded-md bg-sky-600 hover:bg-sky-700">
              <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                  <Cog6ToothIcon className="h-6 w-6"></Cog6ToothIcon>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-14 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-sky-600 text-white' : 'text-gray-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          {active ? (
                            <EditActiveIcon
                              className="mr-2 h-5 w-5"
                              aria-hidden="true"
                            />
                          ) : (
                            <EditInactiveIcon
                              className="mr-2 h-5 w-5"
                              aria-hidden="true"
                            />
                          )}
                          Edit
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-sky-600 text-white' : 'text-gray-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          onClick={() => setDeleteWaringOpen(true)}
                        >
                          {active ? (
                            <DeleteActiveIcon
                              className="mr-2 h-5 w-5 text-violet-400"
                              aria-hidden="true"
                            />
                          ) : (
                            <DeleteInactiveIcon
                              className="mr-2 h-5 w-5 text-violet-400"
                              aria-hidden="true"
                            />
                          )}
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        <Panel title="Public Service Status">
          <div className="flex flex-col p-2 space-y-2">
            <div className="flex items-center flex-col sm:flex-row sm:space-x-1 space-y-2">
              <label className="sm:min-w-8">
                <RocketLaunchIcon className="w-5 mt-1 text-sky-600"></RocketLaunchIcon>
              </label>
              <label className="sm:min-w-60">
                Ready
              </label>
              <span>{state.instance?.status.publicServiceReady ? "Yes" : "No"}</span>
            </div>
            <div className="flex items-center flex-col sm:flex-row sm:space-x-1 space-y-2">
              <label className="sm:min-w-8">
                <BuildingStorefrontIcon className="w-5 mt-1 text-sky-600"></BuildingStorefrontIcon>
              </label>
              <label className="sm:min-w-60">
                Local link
              </label>
              <Link
                className="text-blue-500 hover:text-blue-800"
                to={state.instance?.status.localServiceURL? state.instance?.status.localServiceURL : ""}
                target="_blank"
                rel="noopener noreferrer"
              >
                {state.instance?.status.localServiceURL}
              </Link>
            </div>
          </div>
        </Panel>
        <Panel title="Public Service Logs">
          <div className="bg-neutral-700 text-slate-300 pb-3 pl-3 pr-3 pt-3 h-max text-sm">
            {log}
          </div>
        </Panel>
      </div>
    </div>
  );
}
