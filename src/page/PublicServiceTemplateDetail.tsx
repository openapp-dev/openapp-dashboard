import { Fragment, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Divider, Input } from "react-daisyui";
import { Dialog, Transition } from "@headlessui/react";
import {
  InboxStackIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { PublicServiceTemplate, InputField } from "../types";
import { parseYaml } from "../util";
import Panel from "../component/Panel";
import TemplateMarkdown from "../component/TemplateMarkdown";
import {
  Configuration,
  ConfigurationProvider,
} from "../component/Configuration";

export default function PublicServiceTemplateDetail() {
  const location = useLocation();
  const template: PublicServiceTemplate = location.state.template;
  if (!template) {
    return <div>Template not found</div>;
  }
  const inputs = parseYaml<Record<string, InputField>>(template.spec.inputs);
  const navigate = useNavigate();
  const [publicServiceCreate, setPublicServiceCreate] = useState(false);
  const cancelButtonRef = useRef(null);

  return (
    <ConfigurationProvider>
      <div className="flex flex-col mt-8">
        <Transition.Root show={publicServiceCreate} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            initialFocus={cancelButtonRef}
            onClose={setPublicServiceCreate}
          >
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
                          <QuestionMarkCircleIcon
                            className="h-6 w-6 text-blue-600"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title
                            as="h3"
                            className="text-base font-semibold leading-6 text-gray-900"
                          >
                            Create Public Service
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-900">
                              Are you sure to create Public Service?
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
                          setPublicServiceCreate(false);
                          navigate("/instance/publicservice");
                        }}
                        ref={cancelButtonRef}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className="bg-sky-600 hover:bg-sky-700 mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ring-none sm:mt-0 sm:w-auto"
                        onClick={() => setPublicServiceCreate(false)}
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
            <Link to="/store/app">Public Service Store</Link>
          </span>
          <span>/</span>
          <span className="font-bold">{template.metadata?.name}</span>
        </div>
        <Divider />
        <div className="flex flex-col p-4 space-y-4">
          <div className="flex md:space-x-4 md:flex-row flex-col space-y-2">
            <div className="flex-none w-24 h-24 rounded-md p-2 border border-gray-300 flex items-center justify-center">
              {template.spec.icon === "" ? (
                // Set size
                <span className="font-bold text-6xl">
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
              <div className="text-2xl font-bold">
                {template.metadata?.name}
              </div>
              <div className="text-sm">{template.spec.description}</div>
            </div>
            <div className="flex-none">
              <Button
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-md"
                onClick={() => setPublicServiceCreate(true)}
              >
                <InboxStackIcon className="h-6 w-6 text-white"></InboxStackIcon>
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

              <Configuration inputs={inputs} />
            </div>
          </Panel>
          <Panel title="Public Service details">
            <div className="pl-3 pr-3 pt-3">
              <TemplateMarkdown url={template.spec.url} />
            </div>
          </Panel>
        </div>
      </div>
    </ConfigurationProvider>
  );
}
