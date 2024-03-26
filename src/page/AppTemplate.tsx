import { useEffect, useState } from "react";
import { appTemplate } from "../api";
import { AppTemplate } from "../types";
import TemplateCard from "../component/TemplateCard";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();
  function handleCardClick(appTemplate: AppTemplate) {
    navigate("/store/app/detail", {
      state: { template: appTemplate },
    });
  }

  return (
    <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mt-8">
      {state.appTemplates.map((appTemplate, idx) => (
        <TemplateCard
          key={idx}
          handleCardClick={() => {
            handleCardClick(appTemplate);
          }}
          {...appTemplate.spec}
        />
      ))}
    </div>
  );
}
