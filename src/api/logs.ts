import { requests } from "../util";
import { Response } from "../types/common";
import { server } from "../storage";

async function getLogs(instance: string): Promise<Response<string>> {
  return requests.get<string>(`${server}/api/v1/apps/instances/${instance}/log`);
}

export const logs = {
    getLogs,
};
