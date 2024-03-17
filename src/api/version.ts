import { requests } from "../util";
import { Response } from "../types/common";
import { server } from "../storage";
import { OpenAPPVersion } from "../types/version";

async function getOpenAPPVersion(): Promise<Response<OpenAPPVersion>> {
  return requests.get<OpenAPPVersion>(
    `${server}/version`
  );
}

export const version = {
  getOpenAPPVersion,
};
