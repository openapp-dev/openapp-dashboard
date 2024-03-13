import { useEffect, useState } from "react";
import AppInstanceCard from "../component/AppInstanceCard";
import { appInstance } from "../api/appinstance";
import { AppInstance } from "../types/appinstance";

interface State {
  appInstances: AppInstance[];
  loading: boolean;
  error: string | null;
}

export default function AppInstancePage() {
  const [state, setState] = useState<State>({
    appInstances: [],
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
      setState({ appInstances: data ?? [], loading: false, error: null });
    }
    fetchData();
  }, []);

  useEffect(() => {
    // TODO: send notification
  }, [state.error]);

  return (
    <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
      {state.appInstances.map((appInstance, idx) => (
        <AppInstanceCard key={idx} appInstance={appInstance} />
      ))}
    </div>
  );
}
