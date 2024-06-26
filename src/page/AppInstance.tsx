import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { appInstance, appTemplate } from "../api";
import { AppInstance, AppTemplate } from "../types";

import InstanceCard from "../component/InstanceCard";
import Loading from "../component/Loading";
import NotFound from "../component/NotFound";
import { useNavigate } from "react-router-dom";

interface State {
  appInstances: AppInstance[];
  appTemplates: { [key: string]: AppTemplate };
  loading: boolean;
  error: string | null;
}

interface SearchState {
  appInstances: AppInstance[];
  keyword: string;
}

export default function AppInstancePage() {
  const [state, setState] = useState<State>({
    appInstances: [],
    appTemplates: {},
    loading: true,
    error: null,
  });

  const [searchState, setSearchState] = useState<SearchState>({
    appInstances: state.appInstances,
    keyword: "",
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
      setSearchState({ ...searchState, appInstances: data ?? [] });
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (searchState.keyword === "" || searchState.keyword === undefined) {
      setSearchState({ ...searchState, appInstances: state.appInstances });
    } else {
      const filteredAppInstances = state.appInstances.filter((appInstance) => {
        let instanceName = appInstance.metadata.name ?? "";
        return instanceName
          .toLowerCase()
          .startsWith(searchState.keyword.toLowerCase());
      });
      setSearchState({ ...searchState, appInstances: filteredAppInstances });
    }
  }, [searchState.keyword]);

  useEffect(() => {
    // TODO: send notification
  }, [state.error]);

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchState({ ...searchState, keyword: event.target.value });
  }

  const navigate = useNavigate();

  return (
    <div className="w-full h-full mt-4">
      <div className="w-full mb-16 mt-1">
        <div className="relative sm:mx-auto sm:w-3/5">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <MdSearch className="w-5 h-5 text-gray-400" />
          </div>
          <input
            className="block w-full p-4 ps-10 text-sm text-black border border-gray-200 rounded-lg bg-white focus:outline-blue-500"
            placeholder="Search installed APPs"
            value={searchState.keyword}
            onChange={handleSearchChange}
            required
          />
        </div>
      </div>
      {!state.loading ? (
        searchState.appInstances.length === 0 ? (
          <NotFound />
        ) : (
          <div className="grid xl:grid-cols-8 md:grid-cols-4 grid-cols-2 gap-4">
            {searchState.appInstances.map((appInstance, idx) => (
              <InstanceCard
                key={idx}
                title={appInstance.metadata.name ?? ""}
                icon={
                  state.appTemplates[appInstance.spec.appTemplate].spec.icon
                }
                handleClick={(instanceName) => {
                  navigate("/instance/app/detail", {
                    state: { name: instanceName },
                  });
                }}
              />
            ))}
          </div>
        )
      ) : (
        <Loading />
      )}
    </div>
  );
}
