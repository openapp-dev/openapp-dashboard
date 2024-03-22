import jsYaml from "js-yaml";

function parseYaml<T>(yaml: string): T {
  return jsYaml.dump(yaml) as T;
}

export { parseYaml };
