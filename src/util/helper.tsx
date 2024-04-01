import { Checkbox, Input } from "react-daisyui";
import {
  DocumentIcon } from '@heroicons/react/24/outline';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from "rehype-raw";

function renderFormField([field, properties]: [string, any]) {
  switch (properties.type) {
    case 'integer':
    case 'string':
      return (
        <div key={field} className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
          <label className="sm:min-w-64">{field}</label>
          <Input
            className="sm:w-96 w-full"
            placeholder={properties.description}
            type={properties.type === 'integer' ? 'number' : 'text'}
            required={properties.required}
            defaultValue={properties.default}
          />
        </div>
      );
    case 'boolean':
      return (
        <div key={field} className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
          <label className="sm:min-w-64">{field}</label>
          <Checkbox
            className="sm:w-96 w-full"
            required={properties.required}
            defaultChecked={properties.default === 'true'}
          />
        </div>
      );
    case 'array':
      return (
        <div key={field} className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
          <label className="sm:min-w-64">{field}</label>
          {Object.entries(properties.itemProperties || {}).map(renderFormField)}
        </div>
      );
    case 'object':
      return (
        <div key={field} className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
          <label className="sm:min-w-64">{field}</label>
          {Object.entries(properties.properties || {}).map(renderFormField)}
        </div>
      );
    default:
      return null;
  }
}

async function renderMardownDetails(url: string) {
  try {
    const response = await fetch(url);
    const data = await response.text();

    return (
      <Markdown
        className="prose prose-zinc text-black max-w-none
          prose-li:pl-0 prose-li:mt-0 prose-li:mb-0
          prose-img:mt-0 prose-img:mb-1 prose-a:text-blue-800
          prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-3
          prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3
          prose-hr:m-6
          prose-img:max-w-full prose-img:flex prose-img:inline-flex"
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        urlTransform={function (currentUrl, _key, _node) {
          if (currentUrl.startsWith("http") || url.startsWith("mailto:")) {
            return currentUrl;
          }
          console.log(url);
          const basePath = url.split("/").slice(0, -1).join("/");
          return basePath + currentUrl;
        }}
      >
        {data}
      </Markdown>
    );
  } catch (error) {
    console.error(error);
    return (
      <div className="w-full flex flex-col justify-center items-center">
        <DocumentIcon className="w-10 mt-10 mb-4 text-gray-500" />
        <span className="text-gray-500 font-medium mb-10">No corresponding information</span>
      </div>
    );
  }
}

export { renderFormField, renderMardownDetails };