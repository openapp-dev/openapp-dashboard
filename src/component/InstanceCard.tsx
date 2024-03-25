interface InstanceCardProps {
  title: string;
  icon?: string;
}

export default function InstanceCard({ title, icon }: InstanceCardProps) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        {icon ? (
          <img src={icon} alt="icon" className="w-32 h-32 border rounded-md" />
        ) : (
          <span className="w-32 h-32 text-9xl text-center border rounded-md">
            {title[0].toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex mt-2 text-lg font-semibold justify-center">
        <span>{title}</span>
      </div>
    </div>
  );
}
