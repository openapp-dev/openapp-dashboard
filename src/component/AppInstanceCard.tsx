import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppInstance } from "../types/appinstance";
import { AppTemplate } from "../types/apptemplate";
import { appTemplate } from "../api/apptemplate";

interface AppInstanceCardProps {
  appInstance: AppInstance;
}

interface State {
  appTemplate?: AppTemplate;
  loading: boolean;
  error: string | null;
}

export default function AppInstanceCard({ appInstance }: AppInstanceCardProps) {
  const navigate = useNavigate();

  function handleCardClick() {
    // TODO: navigate to app detail page
    navigate("/instance/app/detail");
  }


  const [state, setState] = useState<State>({
    appTemplate: undefined,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchData() {
      const { success, message, data } =
        await appTemplate.getAppTemplate(appInstance.spec.appTemplate);
      if (!success) {
        setState({ ...state, loading: false, error: message });
        return;
      }
      setState({ appTemplate: data ?? undefined, loading: false, error: null });
    }
    fetchData();
  }, []);

  useEffect(() => {
    // TODO: send notification
  }, [state.error]);

  return (
    <div
      className="flex flex-col space-y-2 p-6 border border-gray-300 rounded-md hover:border-sky-300 hover:cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex">
        <div className="w-12 h-12 border border-gray-300 rounded-md">
          <img
            src={state.appTemplate?.spec.icon}
            alt={appInstance.metadata?.name}
            className="w-full h-full"
          />
        </div>
      </div>
      <div className="text-xl font-bold">
        <span>{appInstance.metadata?.name}</span>
      </div>
    </div>
  );
}
