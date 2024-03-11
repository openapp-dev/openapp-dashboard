import { useEffect, useState } from "react";
import AppTemplateCard from "../component/AppTemplateCard";
import { appTemplate } from "../api/apptemplate";
import { AppTemplate } from "../types/apptemplate";

interface State {
  appTemplates: AppTemplate[];
  loading: boolean;
  error: string | null;
}

export default function AppTemplateStore() {
  const [state, setState] = useState<State>({
    appTemplates: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchData() {
      const { success, message, data } =
        await appTemplate.listAllAppTemplates();
      if (!success) {
        setState({ ...state, loading: false, error: message });
        return;
      }
      setState({ appTemplates: data ?? [], loading: false, error: null });
    }
    fetchData();
  }, []);

  useEffect(() => {
    // TODO: send notification
  }, [state.error]);

  return (
    <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
      {state.appTemplates.map((appTemplate, idx) => (
        <AppTemplateCard key={idx} appTemplate={appTemplate} />
      ))}
    </div>
  );
}
