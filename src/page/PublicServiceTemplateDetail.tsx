import { useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Divider, Input } from "react-daisyui";
import {
  ExclamationCircleIcon,
  InboxStackIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { PublicServiceTemplate, InputField, createPublicServiceInstanceType } from "../types";
import { parseYaml } from "../util";
import Panel from "../component/Panel";
import TemplateMarkdown from "../component/TemplateMarkdown";
import {
  Configuration,
  ConfigurationProvider,
} from "../component/Configuration";
import NotFound from "../component/NotFound";
import { publicServiceInstance } from "../api";
import { OpenAppDialog } from "../component/OpenAppDialog";
import Loading from "../component/Loading";

interface State {
  publicService: string[];
  dialogOpen: boolean;
  errDialogOpen: boolean;
  errorMsg: string;
  edit: boolean;
  loading: boolean;
  error?: string;
}

interface ConfigurationForm {
  instanceName: string;
  inputs: Record<string, any> | null;
}

export default function PublicServiceTemplateDetail() {
  const location = useLocation();
  const template: PublicServiceTemplate = location.state.template;
  const instanceName = location.state.instanceName;
  if (!template) {
    return <NotFound />;
  }
  const inputs = parseYaml<Record<string, InputField>>(template.spec.inputs);
  const [state, setState] = useState<State>({
    publicService: [],
    loading: true,
    edit: instanceName ? true : false,
    dialogOpen: false,
    errDialogOpen: false,
    errorMsg: "",
  });

  const [form, setForm] = useState<ConfigurationForm>({
    instanceName: instanceName ?? "",
    inputs: null,
  });
  const cancelButtonRef = useRef(null);
  const navigate = useNavigate();

  async function handlePublicServiceCreate() {
    let instanceNew = createPublicServiceInstanceType(
      form.instanceName,
      template.metadata.name ?? "",
      form.inputs
    );
    const { success, message } = await publicServiceInstance.createOrUpdatePublicServiceInstance(
      instanceNew
    );
    if (!success) {
      setState((prev) => ({ ...prev, dialogOpen: false, errDialogOpen: true, errorMsg: message }));
      return
    }
    setState((prev) => ({ ...prev, dialogOpen: false }));
    if (state.edit) {
      navigate("/instance/publicservice/detail", {
        state: { name: instanceName },
      });
    } else {
      navigate("/instance/publicservice");
    }
  }

  function handleInstall(data: Record<string, any>) {
    setForm((prev) => {
      return {
        ...prev,
        inputs: data,
      };
    });
    setState((prev) => {
      return {
        ...prev,
        dialogOpen: true,
      };
    });
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  return (
    <ConfigurationProvider>
      <div className="flex flex-col mt-8">
        <OpenAppDialog
          initialFocus={cancelButtonRef}
          show={state.errDialogOpen}
          onClose={(value) =>
            setState((prev) => ({ ...prev, errDialogOpen: value }))
          }
          title={"Error"}
          content={"Error message:" + state.errorMsg + ", please check your input parameters."}
          confirm={<></>}
          cancel={
            <Button
              ref={cancelButtonRef}
              color="primary"
              size="sm"
              onClick={() =>
                setState((prev) => ({ ...prev, errDialogOpen: false }))
              }
            >
              Cancel
            </Button>
          }
          icon={
            <ExclamationCircleIcon
              className="h-6 w-6 text-blue-600"
              aria-hidden="true"
            />
          }
        />
        <OpenAppDialog
          initialFocus={cancelButtonRef}
          show={state.dialogOpen}
          onClose={(value) =>
            setState((prev) => ({ ...prev, dialogOpen: value }))
          }
          title={state.edit ? "Update Public Service" : "Create Public Service"}
          content={
            state.edit
              ? `Are you sure to update Public Service ${form.instanceName}?`
              : "Are you sure to create Public Service?"
          }
          confirm={
            <Button
              color="error"
              size="sm"
              className="text-white"
              onClick={handlePublicServiceCreate}
            >
              Yes
            </Button>
          }
          cancel={
            <Button
              ref={cancelButtonRef}
              color="primary"
              size="sm"
              onClick={() =>
                setState((prev) => ({ ...prev, dialogOpen: false }))
              }
            >
              Cancel
            </Button>
          }
          icon={
            <QuestionMarkCircleIcon
              className="h-6 w-6 text-blue-600"
              aria-hidden="true"
            />
          }
        />
        <div className="flex space-x-1">
          <span className="text-gray-500">
            <Link to="/store/app">Public Service Store</Link>
          </span>
          <span>/</span>
          <span className="font-bold">
            {state.edit && "edit "}
            {template.metadata?.name}
          </span>
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
              <Configuration.Submit
                children={
                  <InboxStackIcon className="h-6 w-6 text-white"></InboxStackIcon>
                }
                onClick={handleInstall}
              />
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
                  disabled={state.edit}
                  className="sm:w-96 w-full focus:outline-blue-500"
                  placeholder="Public Service instance name"
                  value={form.instanceName}
                  onChange={handleChange}
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
