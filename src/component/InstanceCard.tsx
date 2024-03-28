import { useNavigate } from "react-router-dom";

interface InstanceCardProps {
  title: string;
  icon?: string;
}

export default function AppInstanceCard({ title, icon }: InstanceCardProps) {
  const navigate = useNavigate();
  function handleCardClick(instanceName: string) {
    navigate("/instance/app/detail", {
      state: { name: instanceName },
    });
  }

  return (
    <div className="flex flex-col cursor-pointer" onClick={() => handleCardClick(title)}>
      <div className="flex justify-center">
        {icon ? (
          <img src={icon} alt="icon" className="w-16 h-16 border rounded-md hover:border-blue-300" />
        ) : (
          <span className="w-15 h-15 text-9xl text-center border rounded-md">
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
