import jsYaml from "js-yaml";

function parseYaml<T>(yaml: string): T {
  return jsYaml.load(yaml) as T;
}

function encodeYaml(data: Record<string, any>): string {
  return jsYaml.dump(data)
}

export { parseYaml, encodeYaml };
