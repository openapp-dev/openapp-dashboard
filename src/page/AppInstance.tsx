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
        var templateName = appTemplate.metadata.name;
        if (templateName != undefined) {
          appTemplateMap[templateName] = appTemplate;
        }
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
    <div className="w-full">
      <div className="w-full mb-16 mt-1">
        <form className="mx-auto w-3/5">
          <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
              </div>
              <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-black border border-gray-200 rounded-lg bg-white focus:border-blue-500" placeholder="Search installed APPs" required />
          </div>
        </form>
      </div>
      <div className="grid xl:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4">
        {state.appInstances.map((appInstance, idx) => (
          <InstanceCard
            key={idx}
            title={state.appTemplates[appInstance.spec.appTemplate].spec.title}
            icon={state.appTemplates[appInstance.spec.appTemplate].spec.icon}
          />
        ))}
      </div>
    </div>
  );
}
