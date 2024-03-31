import { ReactNode } from "react";

interface PanelProps {
  children?: ReactNode;
  title: string;
}

export default function Panel({ title, children }: PanelProps) {
  return (
    <div className="flex flex-col border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-base-300 px-4 py-2 rounded-t-lg">{title}</div>
      {children}
    </div>
  );
}
