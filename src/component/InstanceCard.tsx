interface InstanceCardProps {
  title: string;
  icon?: string;
  handleClick?: (instanceName: string) => void;
}

export default function InstanceCard({
  title,
  icon,
  handleClick,
}: InstanceCardProps) {
  return (
    <div
      className="flex flex-col cursor-pointer"
      onClick={() => handleClick?.(title)}
    >
      <div className="flex justify-center">
        {icon ? (
          <img
            src={icon}
            alt="icon"
            className="w-16 h-16 border rounded-md hover:border-blue-300 hover:shadow-md"
          />
        ) : (
          <span className="w-16 h-16 text-5xl font-bold text-center border rounded-md hover:shadow-md hover:border-blue-300 flex justify-center items-center">
            {title[0].toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex mt-1 text-s font-semibold justify-center">
        <span>{title}</span>
      </div>
    </div>
  );
}
