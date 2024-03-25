import { useEffect, useState } from "react";
import { appInstance, appTemplate } from "../api";
import { AppInstance, AppTemplate } from "../types";
import InstanceCard from "../component/InstanceCard";

interface State {
  appInstances: AppInstance[];
  appTemplates: { [key: string]: AppTemplate };
  loading: boolean;
  error: string | null;
}

export default function AppInstancePage() {
  const [state, setState] = useState<State>({
    appInstances: [],
    appTemplates: {},
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchData() {
      const { success, message, data } =
        await appInstance.listAllAppInstances();
      if (!success) {
        setState({ ...state, loading: false, error: message });
        return;
      }
      const appTemplates = await appTemplate.listAllAppTemplates();
      if (!appTemplates.success) {
        setState({ ...state, loading: false, error: appTemplates.message });
        return;
      }
      const appTemplateMap: { [key: string]: AppTemplate } = {};
      appTemplates.data?.forEach((appTemplate) => {
        appTemplateMap[appTemplate.spec.title] = appTemplate;
      });

      setState({
        appInstances: data ?? [],
        loading: false,
        error: null,
        appTemplates: appTemplateMap,
      });
    }
    fetchData();
  }, []);

  useEffect(() => {
    // TODO: send notification
  }, [state.error]);

  return (
    <div className="grid xl:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4">
      {state.appInstances.map((appInstance, idx) => (
        <InstanceCard
          key={idx}
          title={state.appTemplates[appInstance.spec.appTemplate].spec.title}
          icon={state.appTemplates[appInstance.spec.appTemplate].spec.icon}
        />
      ))}
    </div>
  );
}
