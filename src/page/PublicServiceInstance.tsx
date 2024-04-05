import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { publicServiceInstance, publicServiceTemplate } from "../api";
import { PublicServiceTemplate, PublicServiceInstance } from "../types";

import { PublicServiceInstanceCard } from "../component/InstanceCard";
import Loading from "../component/Loading";

interface State {
  publicServiceInstances: PublicServiceInstance[];
  publicServiceTemplates: { [key: string]: PublicServiceTemplate };
  loading: boolean;
  error: string | null;
}

interface SearchState {
  instances: PublicServiceInstance[];
  keyword: string;
}

export default function PublicServiceInstancePage() {
  const [state, setState] = useState<State>({
    publicServiceInstances: [],
    publicServiceTemplates: {},
    loading: true,
    error: null,
  });
  const [initialized, setInitialized] = useState<boolean>(false);

  const [searchState, setSearchState] = useState<SearchState>({
    instances: state.publicServiceInstances,
    keyword: "",
  });
  useEffect(() => {
    async function fetchData() {
      const { success, message, data } =
        await publicServiceInstance.listAllPublicServiceInstances();
      if (!success) {
        setState({ ...state, loading: false, error: message });
        return;
      }
      const publicServiceTemplates =
        await publicServiceTemplate.listAllPublicServiceTemplates();
      if (!publicServiceTemplates.success) {
        setState({
          ...state,
          loading: false,
          error: publicServiceTemplates.message,
        });
        return;
      }
      const templateMap: { [key: string]: PublicServiceTemplate } = {};
      publicServiceTemplates.data?.forEach((template) => {
        var templateName = template.metadata.name;
        if (templateName != undefined) {
          templateMap[templateName] = template;
        }
      });
      await new Promise((f) => setTimeout(f, 1000));
      setInitialized(true);
      setState({
        publicServiceInstances: data ?? [],
        publicServiceTemplates: templateMap,
        loading: false,
        error: null,
      });
      setSearchState({ ...searchState, instances: data ?? [] });
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (searchState.keyword === "" || searchState.keyword === undefined) {
      setSearchState({
        ...searchState,
        instances: state.publicServiceInstances,
      });
    } else {
      const filteredInstances = state.publicServiceInstances.filter(
        (instance) => {
          let instanceName = instance.metadata.name ?? "";
          return instanceName
            .toLowerCase()
            .startsWith(searchState.keyword.toLowerCase());
        }
      );
      setSearchState({ ...searchState, instances: filteredInstances });
    }
  }, [searchState.keyword]);

  useEffect(() => {
    // TODO: send notification
  }, [state.error]);

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchState({ ...searchState, keyword: event.target.value });
  }

  return (
    <div className="w-full h-full mt-4">
      <div className="w-full mb-16 mt-1">
        <div className="relative sm:mx-auto sm:w-3/5">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <MdSearch className="w-5 h-5 text-gray-400" />
          </div>
          <input
            className="block w-full p-4 ps-10 text-sm text-black border border-gray-200 rounded-lg bg-white focus:outline-blue-500"
            placeholder="Search installed Public Services"
            value={searchState.keyword}
            onChange={handleSearchChange}
            required
          />
        </div>
      </div>
      {initialized ? (
        searchState.instances.length === 0 ? (
          <div className="w-full h-3/4 flex flex-col justify-center items-center">
            <img
              className="w-1/4 mx-auto align-middle"
              src="../../public/404.png"
            />
          </div>
        ) : (
          <div className="grid xl:grid-cols-8 md:grid-cols-4 grid-cols-2 gap-4">
            {searchState.instances.map((instance, idx) => (
              <PublicServiceInstanceCard
                key={idx}
                title={instance.metadata.name ?? ""}
                icon={""}
              />
            ))}
          </div>
        )
      ) : (
        <Loading></Loading>
      )}
    </div>
  );
}
