import { Link } from "react-router-dom";
import { AppInstance } from "../types/appinstance";
import { AppTemplate } from "../types/apptemplate";
import { useLocation } from "react-router-dom";
import { Button, Divider } from "react-daisyui";

export default function AppInstanceDetail() {
  const location = useLocation();
  const instance: AppInstance = location.state.instance;
  const template: AppTemplate = location.state.template;

  return (
    <div className="flex flex-col">
      <div className="flex space-x-1">
        <span className="text-gray-500">
          <Link to="/instance/app">APP instance</Link>
        </span>
        <span>/</span>
        <span className="font-bold">{instance.metadata?.name}</span>
      </div>
      <Divider />
      <div className="flex flex-col p-4 space-y-4">
        <div className="flex md:space-x-4 md:flex-row flex-col space-y-2">
          <div className="flex-none w-24 h-24 rounded-md p-2 border border-gray-300">
            {template.spec.icon === "" ? (
              <span className="text-lg font-bold">{template.spec.title[0].toUpperCase()}</span>
            ) : (
                <img
                src={template.spec.icon}
                alt={template.spec.title}
                className="w-full h-full"
                />
            )}
          </div>
          <div className="flex-1 flex-col space-y-1">
            <div className="text-2xl font-bold">{instance.metadata?.name}</div>
            <div className="text-sm">Powered by {template.metadata?.name}</div>
            <div className="text-sm">{template.spec.description}</div>
          </div>
          <div className="flex-none">
            <Button className="w-full" color="primary">
              Modify Configuration
            </Button>
          </div>
        </div>
        <div className="flex flex-col border border-gray-300">
          <div className="bg-base-300 px-4 py-2">APP Status</div>
          <div className="flex flex-col p-2 space-y-2">
            <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
              <label className="sm:min-w-64">Ready</label>
              <span>{instance.status.appReady}</span>
            </div>
            <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
              <label className="sm:min-w-64">Local link</label>
              <span>{instance.status.localServiceURL}</span>
            </div>
            <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
              <label className="sm:min-w-64">Public link</label>
              <span>{instance.status.externalServiceURL}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col border border-gray-300">
          <div className="bg-base-300 px-4 py-2">APP log</div>
        </div>
      </div>
    </div>
  );
}
