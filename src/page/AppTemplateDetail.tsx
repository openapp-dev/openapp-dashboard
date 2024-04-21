import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Divider, Input, Select } from "react-daisyui";
import { ExclamationCircleIcon, InboxStackIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { parseYaml } from "../util";
import { appInstance, publicServiceInstance } from "../api";
import { AppTemplate, InputField, createAppInstanceType } from "../types";
import Panel from "../component/Panel";
import {
  Configuration,
  ConfigurationProvider,
} from "../component/Configuration";
import TemplateMarkdown from "../component/TemplateMarkdown";
import { OpenAppDialog } from "../component/OpenAppDialog";
import NotFound from "../component/NotFound";

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
  publicService: string;
  inputs: Record<string, any> | null;
}

export default function AppTemplateDetail() {
  const location = useLocation();
  const template: AppTemplate = location.state.template;
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

  //   fetch public service instance
  useEffect(() => {
    async function fetchData() {
      const { success, message, data } =
        await publicServiceInstance.listAllPublicServiceInstances();
      if (!success) {
        setState((prev) => ({ ...prev, error: message, loading: false }));
        return;
      }
      const publicService = data?.map((item) => item.metadata.name ?? "") ?? [];
      setState((prev) => ({ ...prev, publicService, loading: false }));
    }
    fetchData();
  }, []);
  const [form, setForm] = useState<ConfigurationForm>({
    instanceName: instanceName ?? "",
    publicService: "No Exposure",
    inputs: null,
  });
  const cancelButtonRef = useRef(null);
  const navigate = useNavigate();

  async function handleAppCreate() {
    let appInstanceNew = createAppInstanceType(
      form.instanceName,
      template.metadata.name ?? "",
      form.publicService,
      form.inputs
    );
    const { success, message } = await appInstance.createOrUpdateAppInstance(
      appInstanceNew
    );
    if (!success) {
      setState((prev) => ({ ...prev, dialogOpen: false, errDialogOpen: true, errorMsg: message }));
      return
    }
    setState((prev) => ({ ...prev, dialogOpen: false }));
    if (state.edit) {
      navigate("/instance/app/detail", {
        state: { name: instanceName },
      });
    } else {
      navigate("/instance/app");
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
          title={state.edit ? "Update APP" : "Create APP"}
          content={
            state.edit
              ? `Are you sure to update APP ${form.instanceName}?`
              : "Are you sure to create APP?"
          }
          confirm={
            <Button
              color="error"
              size="sm"
              className="text-white"
              onClick={handleAppCreate}
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
            <Link to="/store/app">APP Store</Link>
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
                  placeholder="APP instance name"
                  value={form.instanceName}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
                <label className="sm:min-w-64">Public Service</label>
                <Select
                  name="publicService"
                  className="sm:w-96 w-full focus:outline-blue-500"
                  value={form.publicService}
                  onChange={handleChange}
                >
                  <Select.Option value="No Exposure">
                    No Exposure
                  </Select.Option>
                  {state.publicService.map((item, idx) => (
                    <Select.Option key={idx} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <Configuration inputs={inputs} />
            </div>
          </Panel>
          <Panel title="APP details">
            <div className="pl-3 pr-3 pt-3">
              <TemplateMarkdown url={template.spec.url} />
            </div>
          </Panel>
        </div>
      </div>
    </ConfigurationProvider>
  );
}
