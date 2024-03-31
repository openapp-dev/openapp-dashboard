import { requests } from "../util";
import { Response } from "../types/common";
import { server } from "../storage";

async function getAPPInstanceLogs(instance: string): Promise<Response<string>> {
  return requests.get<string>(`${server}/api/v1/apps/instances/${instance}/log`);
}

async function getPublicServiceInstanceLogs(instance: string): Promise<Response<string>> {
  return requests.get<string>(`${server}/api/v1/publicservices/instances/${instance}/log`);
}


export const logs = {
  getAPPInstanceLogs,
  getPublicServiceInstanceLogs,
};
