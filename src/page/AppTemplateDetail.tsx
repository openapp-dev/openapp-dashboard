import { Button, Divider, Input } from "react-daisyui";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  InboxStackIcon } from '@heroicons/react/24/outline';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from "rehype-raw";

import { AppTemplate, Inputs } from "../types";
import { renderFormField } from "../util/helper";
import { parseYaml } from "../util";
import Panel from "../component/Panel";
import { useEffect, useState } from "react";

export default function AppTemplateDetail() {
  const location = useLocation();
  const template: AppTemplate = location.state.template;
  if (!template) {
    return <div>Template not found</div>;
  }
  const inputs = parseYaml<Inputs>(template.spec.inputs);

  const [appDetails, setAappDetails] = useState<string>('');
  useEffect(() => {
    if (template.spec.url != "") {
      console.log(template.spec);
      fetch(template.spec.url)
      .then(response => response.text())
      .then(data => {
        setAappDetails(data);
      })
    }
  })

  return (
    <div className="flex flex-col mt-8">
      <div className="flex space-x-1">
        <span className="text-gray-500">
          <Link to="/store/app">APP Store</Link>
        </span>
        <span>/</span>
        <span className="font-bold">{template.metadata?.name}</span>
      </div>
      <Divider />
      <div className="flex flex-col p-4 space-y-4">
        <div className="flex md:space-x-4 md:flex-row flex-col space-y-2">
          <div className="flex-none w-24 h-24 rounded-md p-2 border border-gray-300">
            {template.spec.icon === "" ? (
              <span className="text-lg font-bold">
                {template.spec.title[0].toUpperCase()}
              </span>
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
            <Button className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-md">
              <InboxStackIcon className="h-6 w-6 text-white"></InboxStackIcon>
            </Button>
          </div>
        </div>
        <Panel title="Configuration">
          <div className="flex flex-col p-2 space-y-2">
            {/* Following are the build-in necessary params */}
            <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
              <label className="sm:min-w-64">Instance Name</label>
              <Input
                className="sm:w-96 w-full"
                placeholder="APP instance name"
              />
            </div>
            <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
              <label className="sm:min-w-64">Public Service</label>
              <Input
                className="sm:w-96 w-full"
                placeholder="Public service used to publish the service"
              />
            </div>
            {/* Following are the params rendering based on template spec */}
            {Object.entries(inputs).map(renderFormField)}
          </div>
        </Panel>
        <Panel title="APP details">
          <div className="pl-3 pr-3 pt-3">
            <Markdown
              className="prose prose-zinc text-black max-w-none
                prose-li:pl-0 prose-li:mt-0 prose-li:mb-0
                prose-img:mt-0 prose-img:mb-1 prose-a:text-blue-800
                prose-img:max-w-full prose-img:flex prose-img:inline-flex"
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}>
                {appDetails}
            </Markdown>
          </div>
        </Panel>
      </div>
    </div>
  );
}
