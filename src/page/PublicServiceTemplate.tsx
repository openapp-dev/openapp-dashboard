import { useEffect, useState } from "react";
import { publicServiceTemplate } from "../api/publicservicetemplate";
import { PublicServiceTemplate } from "../types";
import TemplateCard from "../component/TemplateCard";
import { useNavigate } from "react-router-dom";
import { MdSearch } from "react-icons/md";
import { Loading } from "../component/Loading";

interface State {
  publicServiceTemplates: PublicServiceTemplate[];
  loading: boolean;
  error: string | null;
}

interface SearchState {
  publicServiceTemplates: PublicServiceTemplate[];
  keyword: string;
}

export default function PublicServiceTemplateStore() {
  const [state, setState] = useState<State>({
    publicServiceTemplates: [],
    loading: true,
    error: null,
  });

  const [searchState, setSearchState] = useState<SearchState>({
    publicServiceTemplates: state.publicServiceTemplates,
    keyword: "",
  });
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      const { success, message, data } =
        await publicServiceTemplate.listAllPublicServiceTemplates();
      if (!success) {
        setState({ ...state, loading: false, error: message });
        return;
      }
      setState({
        publicServiceTemplates: data ?? [],
        loading: false,
        error: null,
      });

      await new Promise(f => setTimeout(f, 1000));
      setInitialized(true);
      setSearchState({...searchState, publicServiceTemplates: data ?? []});
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (searchState.keyword === "" || searchState.keyword === undefined) {
      setSearchState({ ...searchState, publicServiceTemplates: state.publicServiceTemplates });
    } else {
      const filteredPublicServiceTemplates = state.publicServiceTemplates.filter((template) => {
        let name = template.metadata.name?? "";
        return name.toLowerCase().startsWith(searchState.keyword.toLowerCase());
      });
      setSearchState({ ...searchState, publicServiceTemplates: filteredPublicServiceTemplates });
    }
  }, [searchState.keyword]);

  useEffect(() => {
    // TODO: send notification
  }, [state.error]);

  const navigate = useNavigate();
  function handleCardClick(publicServiceTemplate: PublicServiceTemplate) {
    navigate("/store/publicservice/detail", {
      state: { template: publicServiceTemplate },
    });
  }

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
            placeholder="Search Public Service templates"
            value={searchState.keyword}
            onChange={handleSearchChange}
            required
          />
        </div>
      </div>
      {initialized? (
        searchState.publicServiceTemplates.length === 0 ? (
          <div className="w-full h-3/4 flex flex-col justify-center items-center">
            <img className="w-1/4 mx-auto align-middle" src="../../public/404.png" />
          </div>
        ): (
          <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
            {state.publicServiceTemplates.map((publicServiceTemplate, idx) => (
              <TemplateCard
                key={idx}
                {...publicServiceTemplate.spec}
                handleCardClick={() => {
                  handleCardClick(publicServiceTemplate);
                }}
              />
            ))}
          </div>
        )
      ): (
        <Loading />
      )}
    </div>
  );
}
