import { requests } from "../util";
import { PublicServiceInstance } from "../types/publicserviceinstance";
import { Response } from "../types/common";
import { server } from "../storage";

async function listAllPublicServiceInstances(): Promise<Response<PublicServiceInstance[]>> {
  return requests.get<PublicServiceInstance[]>(`${server}/api/v1/publicservices/instances`);
}

async function getPublicServiceInstance(
  instanceName: string
): Promise<Response<PublicServiceInstance>> {
  return requests.get<PublicServiceInstance>(
    `${server}/api/v1/publicservices/instances/${instanceName}`
  );
}

async function createOrUpdatePublicServiceInstance(publicServiceInstance: PublicServiceInstance) {
  return requests.post(
    `${server}/api/v1/publicservices/instances/${publicServiceInstance.metadata?.name}`,
    publicServiceInstance
  );
}

async function deletePublicServiceInstance(instanceName: string) {
  return requests.del(`${server}/api/v1/publicservices/instances/${instanceName}`);
}

export const publicServiceInstance = {
  listAllPublicServiceInstances,
  getPublicServiceInstance,
  createOrUpdatePublicServiceInstance,
  deletePublicServiceInstance,
};
