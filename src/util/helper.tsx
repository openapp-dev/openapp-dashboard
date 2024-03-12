import { Checkbox, Input } from "react-daisyui";

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

export { renderFormField };