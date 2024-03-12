import { Button, Divider, Input } from "react-daisyui";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { AppTemplate } from "../types/apptemplate";
import { renderFormField } from "../util/helper";
import YAML from 'yaml';

export default function AppTemplateDetail() {
  const location = useLocation();
  const template: AppTemplate = location.state.template;
  if (!template) {
    return <div>Template not found</div>;
  }
  const inputs = YAML.parse(template.spec.inputs);
  return (
    <div className="flex flex-col">
      <div className="flex space-x-1">
        <span className="text-gray-500">
          <Link to="/store/app">APP Store</Link>
        </span>
        <span>/</span>
        <span className="font-bold">Detail</span>
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
          <div className="flex-1 flex-col space-y-4">
            <div className="text-2xl font-bold">{template.metadata?.name}</div>
            <div className="text-sm">{template.spec.description}</div>
          </div>
          <div className="flex-none">
            <Button className="w-full" color="primary">
              Install App
            </Button>
          </div>
        </div>
        <div className="flex flex-col border border-gray-300">
          <div className="bg-base-300 px-4 py-2">Configuration</div>
          <div className="flex flex-col p-2 space-y-2">
            {/* Following are the build-in necessary params */}
            <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
              <label className="sm:min-w-64">APP Installation Name</label>
              <Input
                className="sm:w-96 w-full"
                placeholder="AFFINE_ADMIN_EMAIL"
              />
            </div>
            <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
              <label className="sm:min-w-64">Public Service</label>
              <Input
                className="sm:w-96 w-full"
                placeholder="AFFINE_ADMIN_EMAIL"
              />
            </div>

            {/* Following are the params rendering based on template spec */}
            {Object.entries(inputs).map(renderFormField)}
          </div>
        </div>
        <div className="flex flex-col border border-gray-300">
          <div className="bg-base-300 px-4 py-2">README.md</div>
        </div>
      </div>
    </div>
  );
}
