import { Link } from "react-router-dom";
import { PublicServiceInstance, PublicServiceTemplate } from "../types";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Divider } from "react-daisyui";
import {
  CheckIcon,
  DocumentTextIcon,
  InboxStackIcon,
  QuestionMarkCircleIcon} from '@heroicons/react/24/outline'
import { Transition, Dialog } from '@headlessui/react'
import { Fragment, useRef, useEffect, useState } from 'react'

import Panel from "../component/Panel";
import { publicServiceInstance, publicServiceTemplate } from "../api";
import TemplateMarkdown from "../component/TemplateMarkdown";
import { Loading } from "../component/Loading";

interface State {
  instance: PublicServiceInstance | null;
  template: PublicServiceTemplate | null;
  loading: boolean;
  error: string | null;
}

export default function PublicServiceInstanceEdit() {
  const location = useLocation();
  const instanceName = location.state.name;

  const navigate = useNavigate();
  const [state, setState] = useState<State>({
    instance: null,
    template: null,
    loading: true,
    error: null,
  });

  let emptyDetails = (<Loading />);
  const [details, setDetails] = useState<JSX.Element>(emptyDetails);
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
      setDetails(TemplateMarkdown({
        url: template.data?.spec.url ?? "",
      }));
    }
    fetchData();
  }, []);

  const noExpose = { id: 1, name: 'No exposure', unavailable: false };
  useEffect(() => {
    async function fetchData() {
      const { success, data } = await publicServiceInstance.listAllPublicServiceInstances();
      if (!success) {
        return;
      }
      const publicServiceInstances = data ?? [];
      const svc = publicServiceInstances.map((item) => {
        return {
          id: 1,
          name: item.metadata.name ?? "",
          unavailable: false,
        }
      });
      svc.push(noExpose);
    }
    fetchData();
  }, []);

  useEffect(() => {
    // TODO: send notification
  }, [state.error]);

  const [saveNotificationOpen, setSaveNotificationOpen] = useState(false);
  const [saveResultOpen, setSaveResultOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  return (
    <div className="flex flex-col">
      <Transition.Root show={saveResultOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setSaveResultOpen}>
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
                          Public Service updated
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-900">
                            Public Service has been updated successfully.
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
                          setSaveResultOpen(false);
                          navigate("/instance/publicservice/detail", {
                            state: { name: state.instance?.metadata.name }
                          });
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
      <Transition.Root show={saveNotificationOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setSaveNotificationOpen}>
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
                        <QuestionMarkCircleIcon className="h-6 w-6 text-sky-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left text-gray-700">
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6">
                          Update Public Service
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm">
                            Are you sure to update Public Service {state.instance?.metadata.name}?
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
                        setSaveResultOpen(true);
                        }
                      }
                      ref={cancelButtonRef}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="bg-sky-600 hover:bg-sky-700 mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ring-none sm:mt-0 sm:w-auto"
                      onClick={() => setSaveNotificationOpen(false)}
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
          <Link to="/instance/app">Public Service instance</Link>
        </span>
        <span>/ Edit</span>
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
            <Button className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-md" onClick={() => setSaveNotificationOpen(true)}>
              <InboxStackIcon className="h-6 w-6 text-white" />
            </Button>
          </div>
        </div>
        <Panel title="Configuration">
          <div className="flex flex-col p-2 space-y-2">
            {state.template?.spec.inputs === "" ? (
              <div className="w-full flex flex-col justify-center items-center">
                <DocumentTextIcon className="w-8 mt-10 mb-4 text-gray-500" />
                <span className="text-gray-500 font-medium mb-10">No configuration required</span>
              </div>
            ) : (
              null
            )}
          </div>
        </Panel>
        <Panel title="APP details">
            <div className="pl-3 pr-3 pt-3">
                {details}
            </div>
        </Panel>
      </div>
    </div>
  );
}
