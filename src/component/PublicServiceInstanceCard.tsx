import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicServiceInstance } from "../types/publicserviceinstance";
import { PublicServiceTemplate } from "../types/publicservicetemplate";
import { publicServiceTemplate } from "../api/publicservicetemplate";

interface PublicServiceInstanceCardProps {
  publicServiceInstance: PublicServiceInstance;
}

interface State {
  publicServiceTemplate?: PublicServiceTemplate;
  loading: boolean;
  error: string | null;
}

export default function PublicServiceInstanceCard({ publicServiceInstance }: PublicServiceInstanceCardProps) {
  const navigate = useNavigate();

  function handleCardClick() {
    // TODO: navigate to app detail page
    navigate("/instance/app/detail");
  }


  const [state, setState] = useState<State>({
    publicServiceTemplate: undefined,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchData() {
      const { success, message, data } =
        await publicServiceTemplate.getPublicServiceTemplate(publicServiceInstance.spec.publicServiceTemplate);
      if (!success) {
        setState({ ...state, loading: false, error: message });
        return;
      }
      setState({ publicServiceTemplate: data ?? undefined, loading: false, error: null });
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
        <div className="w-12 h-12 border border-gray-300 rounded-md flex items-center justify-center">
          {state.publicServiceTemplate?.spec.icon === "" ? (
              <span className="text-lg font-bold" style={{ fontSize: "1.5rem" }}>{state.publicServiceTemplate.spec.title[0].toUpperCase()}</span>
          ) : (
              <img
              src={state.publicServiceTemplate?.spec.icon}
              alt={publicServiceInstance.metadata?.name}
              className="w-full h-full"
              />
          )}
        </div>
      </div>
      <div className="text-xl font-bold">
        <span>{publicServiceInstance.metadata?.name}</span>
      </div>
    </div>
  );
}
