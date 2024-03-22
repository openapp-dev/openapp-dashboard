import { Button } from "react-daisyui";
import { MdShare } from "react-icons/md";

interface TemplateCardProps {
  handleCardClick: () => void;
  icon: string;
  title: string;
  description: string;
  author: string;
  url: string;
}

export default function TemplateCard({
  title,
  author,
  description,
  url,
  icon,
  handleCardClick,
}: TemplateCardProps) {
  return (
    <div
      className="flex flex-col space-y-2 sm:p-6 p-4 border border-gray-300 rounded-md hover:border-sky-300 hover:cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex">
        <div className="w-12 h-12 border border-gray-300 rounded-md flex justify-center items-center">
          {icon === "" ? (
            <span className="text-3xl font-bold">{title[0].toUpperCase()}</span>
          ) : (
            <img src={icon} alt={title} className="w-full h-full" />
          )}
        </div>
      </div>
      <div className="text-xl font-bold">
        <span>{title}</span>
      </div>
      <div className="text-sm">
        <p className="truncate">{description}</p>
      </div>
      <div className="flex justify-between items-baseline text-sm">
        <span>By {author}</span>
        <Button
          size="sm"
          color="ghost"
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = url;
          }}
        >
          <MdShare className="hover:cursor-pointer hover:fill-sky-300" />
        </Button>
      </div>
    </div>
  );
}
