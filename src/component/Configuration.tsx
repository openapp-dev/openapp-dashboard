import React, { createContext, useContext, useEffect, useState } from "react";
import { Button, Input, Toggle } from "react-daisyui";
import { InputField } from "../types";
import { MdDelete, MdPlusOne } from "react-icons/md";
import lodash from "lodash";

function renderInputField(input: ConfigurationField) {
  const { fieldKey, type } = input;

  switch (type) {
    case "string":
      return <Configuration.Text {...input} key={fieldKey} />;
    case "integer":
      return <Configuration.Number {...input} key={fieldKey} />;
    case "boolean":
      return <Configuration.Boolean {...input} key={fieldKey} />;
    case "array":
      return <Configuration.Array {...input} key={fieldKey} />;
    case "object":
      return <Configuration.Object {...input} key={fieldKey} />;
    default:
      return <div>Unsupported type</div>;
  }
}

interface ConfigurationProps {
  inputs: Record<string, InputField>;
  existsData?: Record<string, any>;
}

interface ConfigurationSubmitProps {
  onClick: (data: Record<string, any>) => void;
  children: React.ReactNode;
}

interface ConfigurationField {
  fieldKey: string;
  name: string;
  type: "string" | "integer" | "boolean" | "array" | "object";
  required: boolean;
  description: string;
  default?: string | number | boolean | any[] | Record<string, any>;
  items?: {
    type: "string" | "integer" | "boolean" | "array" | "object";
    properties?: Record<string, ConfigurationField>;
  };
  properties?: Record<string, ConfigurationField>;
}

interface ConfigurationContextType {
  data: Record<string, any>;
  setValue: (key: string, value: any) => void;
  remove: (key: string) => void;
  getValues: () => Record<string, any>;
}

const ConfigurationContext = createContext<ConfigurationContextType>(null!);

function ConfigurationProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Record<string, any>>({});

  function remove(key: string) {
    const { [key]: removed, ...rest } = data;
    setData(rest);
  }

  function setValue(key: string, value: any) {
    setData((prevData) => {
      return {
        ...prevData,
        [key]: value,
      };
    });
  }

  function getValues() {
    const res = {};
    Object.entries(data).forEach(([key, value]) => {
      lodash.set(res, key, value);
    });
    return res as Record<string, any>;
  }

  const value = { data, setValue, remove, getValues };

  return (
    <ConfigurationContext.Provider value={value}>
      {children}
    </ConfigurationContext.Provider>
  );
}

const Configuration: React.FC<ConfigurationProps> & {
  Text: React.FC<ConfigurationField>;
  Number: React.FC<ConfigurationField>;
  Boolean: React.FC<ConfigurationField>;
  Array: React.FC<ConfigurationField>;
  Object: React.FC<ConfigurationField>;
  Submit: React.FC<ConfigurationSubmitProps>;
} = ({ inputs, existsData }) => {
  return (
    <>
      {Object.entries(inputs).map(([key, field]) => {
        // first level of configuration, key is the name of the configuration
        return renderInputField({
          ...field,
          fieldKey: key,
          name: key,
          default: existsData ? existsData[key] : field.default,
        } as ConfigurationField);
      })}
    </>
  );
};

Configuration.Text = ({
  fieldKey,
  name,
  description,
  required,
  default: defaultValue,
}) => {
  const { setValue } = useContext(ConfigurationContext);
  const [state, setState] = useState<string>((defaultValue as string) ?? "");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setState(e.target.value);
  }

  useEffect(() => {
    setValue(fieldKey, state);
  }, [state]);

  return (
    <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
      <label className="sm:min-w-64">{name}</label>
      <Input
        key={fieldKey}
        className="w-full sm:w-96 focus:outline-blue-500"
        type="text"
        name={fieldKey}
        required={required}
        placeholder={description}
        value={state}
        onChange={handleChange}
      />
    </div>
  );
};

Configuration.Number = ({
  fieldKey,
  name,
  description,
  required,
  default: defaultValue,
}) => {
  const { setValue } = useContext(ConfigurationContext);
  const [state, setState] = useState<number>((defaultValue as number) ?? 0);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setState(e.target.valueAsNumber);
  }

  useEffect(() => {
    setValue(fieldKey, state);
  }, [state]);

  return (
    <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
      <label className="sm:min-w-64">{name}</label>
      <Input
        key={fieldKey}
        className="w-full sm:w-96 focus:outline-blue-500"
        type="number"
        name={fieldKey}
        required={required}
        placeholder={description}
        value={state}
        onChange={handleChange}
      />
    </div>
  );
};

Configuration.Boolean = ({ fieldKey, name, required }) => {
  return (
    <div
      className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2"
      key={fieldKey}
    >
      <label className="sm:min-w-64">{name}</label>
      <Toggle name={name} required={required} />
    </div>
  );
};

Configuration.Array = ({
  fieldKey,
  name,
  description,
  items,
  default: defaultValue,
}) => {
  const [itemState, setItemState] = useState<ConfigurationField[]>([]);
  const { remove } = useContext(ConfigurationContext);

  function handleAdd() {
    setItemState((prev) => [
      ...prev,
      {
        ...items,
        fieldKey: `${fieldKey}[${prev.length}]`,
        name: `${prev.length}`,
      } as ConfigurationField,
    ]);
  }

  function handleDelete() {
    setItemState((prev) => {
      // remove the last item
      const newState = [...prev];
      newState.pop();
      return newState;
    });
    remove(`${fieldKey}[${itemState.length - 1}]`);
  }

  useEffect(() => {
    if (defaultValue) {
      const data = (defaultValue as Array<any>).map((item, idx) => {
        return {
          fieldKey: `${fieldKey}[${idx}]`,
          name: `${idx}`,
          default: item,
        } as ConfigurationField;
      });
      setItemState(data);
    }
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex bg-gray-100 border items-center justify-between px-1">
        <span>
          {name} - {description}
        </span>
        <div>
          <Button color="ghost" onClick={handleAdd}>
            <MdPlusOne className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col">
        {itemState.map((item, idx) => {
          return (
            <div className="flex items-center space-x-2" key={idx}>
              {renderInputField({
                ...item,
                default: defaultValue
                  ? (defaultValue as Array<any>)[idx]
                  : item.default,
              } as ConfigurationField)}
              {idx === itemState.length - 1 && (
                <Button color="ghost" onClick={handleDelete}>
                  <MdDelete className="w-5 h-5" />
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

Configuration.Object = ({
  fieldKey,
  name,
  description,
  properties,
  default: defaultValue,
}) => {
  return (
    <div className="flex flex-col mb-2">
      <div className="flex bg-gray-100 border items-center justify-between px-1 h-12">
        <span>
          {name} - {description}
        </span>
      </div>
      <div className="flex flex-col">
        {Object.entries(properties ?? {}).map(([sKey, value]) => {
          return renderInputField({
            ...value,
            fieldKey: `${fieldKey}.${sKey}`,
            name: sKey,
            default: defaultValue
              ? (defaultValue as Record<string, any>)[sKey]
              : value.default,
          } as ConfigurationField);
        })}
      </div>
    </div>
  );
};

Configuration.Submit = ({ children, onClick }) => {
  const { getValues } = useContext(ConfigurationContext);
  return (
    <Button
      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-md"
      onClick={() => {
        const data = getValues();
        onClick(data);
      }}
    >
      {children}
    </Button>
  );
};

export { Configuration, ConfigurationProvider, ConfigurationContext };
