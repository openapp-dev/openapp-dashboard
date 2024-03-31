import { useEffect, useState } from "react";
import { appTemplate } from "../api";
import { AppTemplate } from "../types";
import TemplateCard from "../component/TemplateCard";
import { useNavigate } from "react-router-dom";
import { MdSearch } from "react-icons/md";

interface State {
  appTemplates: AppTemplate[];
  loading: boolean;
  error: string | null;
}

interface SearchState {
  appTemplates: AppTemplate[];
  keyword: string;
}

export default function AppTemplateStore() {
  const [state, setState] = useState<State>({
    appTemplates: [],
    loading: true,
    error: null,
  });

  const [searchState, setSearchState] = useState<SearchState>({
    appTemplates: state.appTemplates,
    keyword: "",
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
      setSearchState({...searchState, appTemplates: data ?? []});
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (searchState.keyword === "" || searchState.keyword === undefined) {
      setSearchState({ ...searchState, appTemplates: state.appTemplates });
    } else {
      const filteredAppTemplates = state.appTemplates.filter((appTemplate) => {
        let name = appTemplate.metadata.name?? "";
        return name.toLowerCase().startsWith(searchState.keyword.toLowerCase());
      });
      setSearchState({ ...searchState, appTemplates: filteredAppTemplates });
    }
  }, [searchState.keyword]);

  useEffect(() => {
    // TODO: send notification
  }, [state.error]);

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchState({ ...searchState, keyword: event.target.value });
  }

  const navigate = useNavigate();
  function handleCardClick(appTemplate: AppTemplate) {
    navigate("/store/app/detail", {
      state: { template: appTemplate },
    });
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
            placeholder="Search APP templates"
            value={searchState.keyword}
            onChange={handleSearchChange}
            required
          />
        </div>
      </div>
      {searchState.appTemplates.length === 0 ? (
        <div className="w-full h-3/4 flex flex-col justify-center items-center">
          <img className="w-1/4 mx-auto align-middle" src="../../public/404.png" />
        </div>
      ): (
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
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
      )}
    </div>
  );
}
