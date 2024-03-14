import { useEffect, useState } from "react";
import PublicServiceInstanceCard from "../component/PublicServiceInstanceCard";
import { publicServiceInstance } from "../api/publicserviceinstance";
import { PublicServiceInstance } from "../types/publicserviceinstance";

interface State {
  publicServiceInstances: PublicServiceInstance[];
  loading: boolean;
  error: string | null;
}

export default function PublicServiceInstancePage() {
  const [state, setState] = useState<State>({
    publicServiceInstances: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchData() {
      const { success, message, data } =
        await publicServiceInstance.listAllPublicServiceInstances();
      if (!success) {
        setState({ ...state, loading: false, error: message });
        return;
      }
      setState({ publicServiceInstances: data ?? [], loading: false, error: null });
    }
    fetchData();
  }, []);

  useEffect(() => {
    // TODO: send notification
  }, [state.error]);

  return (
    <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
      {state.publicServiceInstances.map((publicServiceInstance, idx) => (
        <PublicServiceInstanceCard key={idx} publicServiceInstance={publicServiceInstance} />
      ))}
    </div>
  );
}
