import { AppTemplate } from "../types/apptemplate";
import { Response } from "../types/common";
import { requests } from "../util";

async function listAllAppTemplates(): Promise<Response<AppTemplate[]>> {
  return requests.get<AppTemplate[]>("/api/v1/apps/templates");
}

async function getAppTemplate(name: string): Promise<Response<AppTemplate>> {
  return requests.get<AppTemplate>(`/api/v1/apps/templates/${name}`);
}

export const appTemplate = {
  listAllAppTemplates,
  getAppTemplate,
};
