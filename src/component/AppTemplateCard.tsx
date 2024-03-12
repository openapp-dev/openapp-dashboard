import { MdShare } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AppTemplate } from "../types/apptemplate";

interface AppTemplateCardProps {
  appTemplate: AppTemplate;
}

export default function AppTemplateCard({ appTemplate }: AppTemplateCardProps) {
  const navigate = useNavigate();

  function handleCardClick() {
    // TODO: navigate to app detail page
    navigate("/store/app/detail", {
      state: {template: appTemplate}
    });
  }

  return (
    <div
      className="flex flex-col space-y-2 p-6 border border-gray-300 rounded-md hover:border-sky-300 hover:cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex">
        <div className="w-12 h-12 border border-gray-300 rounded-md">
          <img
            src={appTemplate.spec.icon}
            alt={appTemplate.spec.title}
            className="w-full h-full"
          />
        </div>
      </div>
      <div className="text-xl font-bold">
        <span>{appTemplate.spec.title}</span>
      </div>
      <div className="text-sm">
        <p>{appTemplate.spec.description}</p>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span>By {appTemplate.spec.author}</span>
        <a href={appTemplate.spec.url}>
          <MdShare className="hover:cursor-pointer hover:fill-sky-300" />
        </a>
      </div>
    </div>
  );
}
