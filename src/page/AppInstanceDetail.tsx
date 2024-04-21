import { Fragment, useRef, ReactElement, useEffect, useState, JSXElementConstructor } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Divider } from "react-daisyui";
import {
  Cog6ToothIcon,
  RocketLaunchIcon,
  BuildingStorefrontIcon,
  GlobeAltIcon,
  ExclamationCircleIcon,
  CheckBadgeIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { MdDelete, MdEdit } from "react-icons/md";
import { Menu, Transition } from "@headlessui/react";
import { appInstance, appTemplate, logs } from "../api";
import { AppTemplate, AppInstance } from "../types";
import Panel from "../component/Panel";
import { OpenAppDialog } from "../component/OpenAppDialog";

interface State {
  appInstance?: AppInstance;
  appTemplate?: AppTemplate;
  log: ReactElement[];
  loading: boolean;
  error?: string;
}

export default function AppInstanceDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const instanceName = location.state.name;

  const [state, setState] = useState<State>({
    appInstance: null!,
    appTemplate: null!,
    loading: true,
    log: [],
  });

  useEffect(() => {
    async function fetchData() {
      const instance = await appInstance.getAppInstance(instanceName);
      if (!instance.success) {
        setState({ ...state, loading: false, error: instance.message });
        return;
      }
      let templateName = instance.data?.spec.appTemplate;
      if (!templateName) {
        setState({
          ...state,
          loading: false,
          error: "Can not find the template name",
        });
        return;
      }
      const template = await appTemplate.getAppTemplate(templateName);
      if (!template.success) {
        setState({ ...state, loading: false, error: template.message });
        return;
      }

      let logDetail: ReactElement<any, string | JSXElementConstructor<any>>[] = [];
      const logGet = await logs.getAPPInstanceLogs(instanceName);
      if (logGet.success) {
        logDetail = (logGet.data ?? "").split("\n").map((line) => (
          <>
            {line}
            <br />
          </>
        ));
      }
      setState({
        ...state,
        appInstance: instance.data,
        appTemplate: template.data,
        log: logDetail,
      });
    }
    fetchData();
  }, []);

  useEffect(() => {
    // TODO: send notification
  }, [state.error]);

  async function handleDeleteAPPInstance() {
    let name = state.appInstance?.metadata.name;
    if (!name) {
      return;
    }
    const { success, message } = await appInstance.deleteAppInstance(name);
    if (!success) {
      setState({ ...state, error: message });
      return;
    }
    setDeleteResultOpen(true);
  }

  const [deleteWaringOpen, setDeleteWaringOpen] = useState(false);
  const [deleteResultOpen, setDeleteResultOpen] = useState(false);
  const cancelButtonRef = useRef(null);

  return (
    <div className="flex flex-col mt-8">
      <OpenAppDialog
        show={deleteResultOpen}
        title="APP deleted"
        content="APP has been deleted successfully."
        confirm={
          <Button
            color="error"
            size="sm"
            className="text-white"
            ref={cancelButtonRef}
            onClick={() => {
              setDeleteWaringOpen(false);
              navigate("/instance/app");
            }}
          >
            OK
          </Button>
        }
        icon={
          <CheckIcon
            className="h-6 w-6 text-blue-600"
            aria-hidden="true"
          />
        }
      />
      <OpenAppDialog
        show={deleteWaringOpen}
        title="Waring"
        content={`Are you sure to delete APP ${state.appInstance?.metadata.name}`}
        confirm={
          <Button
            color="error"
            size="sm"
            className="text-white"
            onClick={() => {
              setDeleteWaringOpen(false);
              handleDeleteAPPInstance();
            }}
          >
            Yes
          </Button>
        }
        cancel={
          <Button
            color="info"
            size="sm"
            className="text-white"
            onClick={() => {
              setDeleteWaringOpen(false);
            }}
            ref={cancelButtonRef}
          >
            No
          </Button>
        }
        icon={
          <ExclamationCircleIcon
            className="h-6 w-6 text-blue-600"
            aria-hidden="true"
          />
        }
      />
      <div className="flex space-x-1">
        <span className="text-gray-500">
          <Link to="/instance/app">APP instance</Link>
        </span>
        <span>/</span>
        <span className="font-bold">{state.appInstance?.metadata.name}</span>
      </div>
      <Divider />
      <div className="flex flex-col p-4 space-y-4">
        <div className="flex md:space-x-4 md:flex-row flex-col space-y-2">
          <div className="flex-none w-24 h-24 rounded-md p-2 border border-gray-300">
            {state.appTemplate?.spec.icon === "" ? (
              <span className="text-lg font-bold">
                {state.appTemplate?.spec.title[0].toUpperCase()}
              </span>
            ) : (
              <img
                src={state.appTemplate?.spec.icon}
                alt={state.appTemplate?.spec.title}
                className="w-full h-full"
              />
            )}
          </div>
          <div className="flex-1 flex-col space-y-1">
            <div className="text-2xl font-bold">
              {state.appInstance?.metadata.name}
            </div>
            <div className="text-sm">
              Powered by {state.appTemplate?.metadata.name}
            </div>
            <div className="text-sm">{state.appTemplate?.spec.description}</div>
          </div>
          <div className="flex-none">
            <Menu
              as="div"
              className="inline-block text-left rounded-md bg-sky-600 hover:bg-sky-700"
            >
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
                            active ? "bg-sky-600 text-white" : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          onClick={() => {
                            navigate("/instance/app/edit", {
                              state: {
                                template: state.appTemplate,
                                instanceName: state.appInstance?.metadata.name,
                              },
                            });
                          }}
                        >
                          <MdEdit
                            className={`mr-2 h-5 w-5 ${
                              active ? "text-white" : "text-purple-500"
                            }`}
                            aria-hidden="true"
                          />
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
                            active ? "bg-sky-600 text-white" : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          onClick={() => setDeleteWaringOpen(true)}
                        >
                          <MdDelete
                            className={`mr-2 h-5 w-5 ${
                              active ? "text-white" : "text-purple-500"
                            }`}
                            aria-hidden="true"
                          />
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
        <Panel title="APP Status">
          <div className="flex flex-col p-2 space-y-4">
            <div className="flex flex-col items-center sm:flex-row">
              <label className="sm:min-w-8">
                <RocketLaunchIcon className="w-5 text-sky-600"></RocketLaunchIcon>
              </label>
              <label className="sm:min-w-60">Ready</label>
              <span>{state.appInstance?.status?.appReady ? "Yes" : "No"}</span>
            </div>
            <div className="flex items-center flex-col sm:flex-row">
              <label className="sm:min-w-8">
                <BuildingStorefrontIcon className="w-5 text-sky-600"></BuildingStorefrontIcon>
              </label>
              <label className="sm:min-w-60">Local link</label>
              <Link
                className="text-blue-500 hover:text-blue-800"
                to={state.appInstance?.status?.localServiceURL ?? ""}
                target="_blank"
                rel="noopener noreferrer"
              >
                {state.appInstance?.status?.localServiceURL}
              </Link>
            </div>
            <div className="flex items-center flex-col sm:flex-row">
              <label className="sm:min-w-8">
                <GlobeAltIcon className="w-5 text-sky-600"></GlobeAltIcon>
              </label>
              <label className="sm:min-w-60">Public link</label>
              <Link
                className="text-blue-500 hover:text-blue-800"
                to={state.appInstance?.status?.externalServiceURL ?? ""}
                target="_blank"
                rel="noopener noreferrer"
              >
                {state.appInstance?.status?.externalServiceURL}
              </Link>
            </div>
          </div>
        </Panel>
        <Panel title="APP Logs">
          <div className="bg-neutral-700 text-slate-300 pb-3 pl-3 pr-3 pt-3 h-max text-sm rounded-b-lg">
            {state.log}
          </div>
        </Panel>
      </div>
    </div>
  );
}
