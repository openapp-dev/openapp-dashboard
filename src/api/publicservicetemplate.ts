import { server } from "../storage";
import { PublicServiceTemplate } from "../types/publicservicetemplate";
import { Response } from "../types/common";
import { requests } from "../util";

async function listAllPublicServiceTemplates(): Promise<Response<PublicServiceTemplate[]>> {
  return requests.get<PublicServiceTemplate[]>(`${server}/api/v1/publicservices/templates`);
}

async function getPublicServiceTemplate(name: string): Promise<Response<PublicServiceTemplate>> {
  return requests.get<PublicServiceTemplate>(`${server}/api/v1/publicservices/templates/${name}`);
}

export const publicServiceTemplate = {
    listAllPublicServiceTemplates,
  getPublicServiceTemplate,
};
