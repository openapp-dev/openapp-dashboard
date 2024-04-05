import jsYaml from "js-yaml";

function parseYaml<T>(yaml: string): T {
  return jsYaml.load(yaml) as T;
}

export { parseYaml };
