import { requests } from "../util";
import { AppInstance } from "../types/appinstance";
import { Response } from "../types/common";

async function listAllAppInstances(): Promise<Response<AppInstance[]>> {
  return requests.get<AppInstance[]>("/api/v1/apps/instances");
}

async function getAppInstance(
  instanceName: string
): Promise<Response<AppInstance>> {
  return requests.get<AppInstance>(`/api/v1/apps/instances/${instanceName}`);
}

async function createOrUpdateAppInstance(appinstance: AppInstance) {
  return requests.post(
    `/api/v1/apps/instances/${appinstance.metadata?.name}`,
    appinstance
  );
}

async function deleteAppInstance(instanceName: string) {
  return requests.del(`/api/v1/apps/instances/${instanceName}`);
}

export const appInstance = {
  listAllAppInstances,
  getAppInstance,
  createOrUpdateAppInstance,
  deleteAppInstance,
};
