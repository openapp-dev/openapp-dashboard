import { Button, Divider, Input } from "react-daisyui";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  DocumentIcon,
  InboxStackIcon,
  QuestionMarkCircleIcon} from '@heroicons/react/24/outline';
import { useEffect, useState, Fragment, useRef } from "react";
import { Dialog, Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

import { AppTemplate, Inputs } from "../types";
import { renderFormField, renderMardownDetails } from "../util/helper";
import { parseYaml } from "../util";
import { publicServiceInstance } from "../api/publicserviceinstance";
import Panel from "../component/Panel";


export default function AppTemplateDetail() {
  const location = useLocation();
  const template: AppTemplate = location.state.template;
  if (!template) {
    return <div>Template not found</div>;
  }
  const inputs = parseYaml<Inputs>(template.spec.inputs);

  let emptyDetails = (
    <div className="w-full flex flex-col justify-center items-center">
      <DocumentIcon
        className="w-10 mt-10 mb-4 text-gray-500">
      </DocumentIcon>
      <span className="text-gray-500 font-medium mb-10">No corresponding APP information</span>
    </div>
  );
  const [appDetails, setAppDetails] = useState<JSX.Element>(emptyDetails);
  useEffect(() => {
    const fetchAppDetails = async () => {
      setAppDetails(await renderMardownDetails(template.spec.url));
    };
    fetchAppDetails();
  }, []);

  const [publicService, setPublicService] = useState([{ id: 1, name: 'No exposure', unavailable: false }])
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
      svc.push({ id: 1, name: 'No exposure', unavailable: false });
      setPublicService(svc);
    }
    fetchData();
  }, []);

  const navigate = useNavigate();
  const [appCreate, setAppCreate] = useState(false);
  const cancelButtonRef = useRef(null);
  const [selected, setSelected] = useState(publicService[0]);
  return (
    <div className="flex flex-col mt-8">
      <Transition.Root show={appCreate} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setAppCreate}>
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
                        <QuestionMarkCircleIcon className="h-6 w-6 text-gray-900" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                          Create APP
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-900">
                            Are you sure to create APP?
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
                          setAppCreate(false);
                          navigate("/instance/app");
                        }
                      }
                      ref={cancelButtonRef}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="bg-sky-600 hover:bg-sky-700 mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ring-none sm:mt-0 sm:w-auto"
                      onClick={() => setAppCreate(false)}
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
          <Link to="/store/app">APP Store</Link>
        </span>
        <span>/</span>
        <span className="font-bold">{template.metadata?.name}</span>
      </div>
      <Divider />
      <div className="flex flex-col p-4 space-y-4">
        <div className="flex md:space-x-4 md:flex-row flex-col space-y-2">
          <div className="flex-none w-24 h-24 rounded-md p-2 border border-gray-300">
            {template.spec.icon === "" ? (
              <span className="text-lg font-bold">
                {template.spec.title[0].toUpperCase()}
              </span>
            ) : (
              <img
                src={template.spec.icon}
                alt={template.spec.title}
                className="w-full h-full"
              />
            )}
          </div>
          <div className="flex-1 flex-col space-y-4">
            <div className="text-2xl font-bold">{template.metadata?.name}</div>
            <div className="text-sm">{template.spec.description}</div>
          </div>
          <div className="flex-none">
            <Button className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-md" onClick={() => setAppCreate(true)}>
              <InboxStackIcon className="h-6 w-6 text-white">
              </InboxStackIcon>
            </Button>
          </div>
        </div>
        <Panel title="Configuration">
          <div className="flex flex-col p-2 space-y-2">
            {/* Following are the build-in necessary params */}
            <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
              <label className="sm:min-w-64">Instance Name</label>
              <Input
                name="instanceName"
                type="text"
                className="sm:w-96 w-full focus:outline-blue-500"
                placeholder="APP instance name"
              />
            </div>

            <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
              <label className="sm:min-w-64">Public Service</label>
              <Listbox value={selected} onChange={setSelected}>
                <div className="relative mt-1 sm:w-96 w-full">
                  <Listbox.Button className="relative w-full cursor-default text-white rounded-lg bg-sky-600 py-2 pl-3 pr-10 text-left shadow-none focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300">
                    <span className="block truncate">{selected.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-x-auto	 rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                      {publicService.map((svc, svcIndex) => (
                        <Listbox.Option
                          key={svcIndex}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? 'bg-sky-600 text-white rounded-lg' : 'text-gray-900'
                            }`
                          }
                          value={svc}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? 'font-medium' : 'font-normal'
                                }`}
                              >
                                {svc.name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>

            {/* Following are the params rendering based on template spec */}
            {Object.entries(inputs).map(renderFormField)}
          </div>
        </Panel>
        <Panel title="APP details">
          <div className="pl-3 pr-3 pt-3">
            {appDetails}
          </div>
        </Panel>
      </div>
    </div>
  );
}
