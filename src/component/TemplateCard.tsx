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
  icon,
  handleCardClick,
}: TemplateCardProps) {
  return (
    <div
      className="flex flex-col space-y-2 sm:p-6 p-4 border border-gray-300 rounded-md hover:border-sky-300 hover:cursor-pointer hover:shadow-md"
      onClick={handleCardClick}
    >
      <div className="flex flex-col justify-center w-full flex-row">
        <div className="w-full h-12 flex items-center relative">
          {icon === "" ? (
            <span className="text-3xl font-bold h-full w-12 border border-gray-300 rounded-md flex justify-center items-center">{title[0].toUpperCase()}</span>
          ) : (
            <img src={icon} alt={title} className="h-full w-12 border border-gray-300 rounded-md" />
          )}
          <div className="text-xl font-bold mr-2 absolute right-1/3">
            <span>{title}</span>
          </div>
        </div>
      </div>
      <div className="text-sm">
        <p className="truncate">{description}</p>
      </div>
      <div className="flex justify-between items-baseline text-sm">
        <em className="font-bold">By {author}</em>
      </div>
    </div>
  );
}
