import { requests } from "../util";
import { Response, AppInstance } from "../types";
import { server } from "../storage";

async function listAllAppInstances(): Promise<Response<AppInstance[]>> {
  return requests.get<AppInstance[]>(`${server}/api/v1/apps/instances`);
}

async function getAppInstance(
  instanceName: string
): Promise<Response<AppInstance>> {
  return requests.get<AppInstance>(
    `${server}/api/v1/apps/instances/${instanceName}`
  );
}

async function createOrUpdateAppInstance(appinstance: AppInstance) {
  return requests.post(
    `${server}/api/v1/apps/instances/${appinstance.metadata?.name}`,
    appinstance
  );
}

async function deleteAppInstance(instanceName: string) {
  return requests.del(`${server}/api/v1/apps/instances/${instanceName}`);
}

export const appInstance = {
  listAllAppInstances,
  getAppInstance,
  createOrUpdateAppInstance,
  deleteAppInstance,
};
