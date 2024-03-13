import { MdShare } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { PublicServiceTemplate } from "../types/publicservicetemplate";

interface PublicServiceTemplateCardProps {
  publicServiceTemplate: PublicServiceTemplate;
}

export default function PublicServiceTemplateCard({ publicServiceTemplate }: PublicServiceTemplateCardProps) {
  const navigate = useNavigate();

  function handleCardClick() {
    // TODO: navigate to publicservice template detail page
    navigate("/store/publicservice/detail", {
        state: {template: publicServiceTemplate}
    });
  }

  return (
    <div
      className="flex flex-col space-y-2 p-6 border border-gray-300 rounded-md hover:border-sky-300 hover:cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex">
        <div className="w-12 h-12 border border-gray-300 rounded-md flex items-center justify-center">
        {publicServiceTemplate.spec.icon === "" ? (
            <span className="text-lg font-bold" style={{ fontSize: "1.5rem" }}>{publicServiceTemplate.spec.title[0].toUpperCase()}</span>
        ) : (
            <img
            src={publicServiceTemplate.spec.icon}
            alt={publicServiceTemplate.spec.title}
            className="w-full h-full"
            />
        )}
        </div>
      </div>
      <div className="text-xl font-bold">
        <span>{publicServiceTemplate.spec.title}</span>
      </div>
      <div className="text-sm">
        <p>{publicServiceTemplate.spec.description}</p>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span>By {publicServiceTemplate.spec.author}</span>
        <a href={publicServiceTemplate.spec.url}>
          <MdShare className="hover:cursor-pointer hover:fill-sky-300" />
        </a>
      </div>
    </div>
  );
}
