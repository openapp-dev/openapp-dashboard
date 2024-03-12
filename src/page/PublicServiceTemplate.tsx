import { useEffect, useState } from "react";
import PublicServiceTemplateCard from "../component/PublicServiceTemplateCard";
import { publicServiceTemplate } from "../api/publicservicetemplate";
import { PublicServiceTemplate } from "../types/publicservicetemplate";

interface State {
  publicServiceTemplates: PublicServiceTemplate[];
  loading: boolean;
  error: string | null;
}

export default function PublicServiceTemplateStore() {
  const [state, setState] = useState<State>({
    publicServiceTemplates: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchData() {
      const { success, message, data } =
        await publicServiceTemplate.listAllPublicServiceTemplates();
      if (!success) {
        setState({ ...state, loading: false, error: message });
        return;
      }
      setState({ publicServiceTemplates: data ?? [], loading: false, error: null });
    }
    fetchData();
  }, []);

  useEffect(() => {
    // TODO: send notification
  }, [state.error]);

  return (
    <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
      {state.publicServiceTemplates.map((publicServiceTemplate, idx) => (
        <PublicServiceTemplateCard key={idx} publicServiceTemplate={publicServiceTemplate} />
      ))}
    </div>
  );
}
