import { requests } from "../util";
import { Response } from "../types/common";
import { server } from "../storage";
import { OpenAPPConfig } from "../types/config";

async function getSetting(): Promise<Response<OpenAPPConfig>> {
  return requests.get<OpenAPPConfig>(
    `${server}/api/v1/config`
  );
}

async function updateSetting(config: OpenAPPConfig) {
  return requests.post(
    `${server}/api/v1/config`,
    config
  );
}

export const setting = {
  getSetting,
  updateSetting,
};
