import { DerivedResource } from "./common";
import {
  ObjectMeta,
  ListMeta,
} from "@kubernetes-models/apimachinery/apis/meta/v1";
import { TypeMeta } from "@kubernetes-models/base";
import { encodeYaml } from "../util/ymal";
interface AppInstance extends TypeMeta {
  metadata: ObjectMeta;
  spec: AppInstanceSpec;
  status?: AppInstanceStatus;
}

interface AppInstanceSpec {
  publicServiceClass?: string;
  appTemplate: string;
  inputs: string;
}

interface AppInstanceStatus {
  appReady?: boolean;
  externalServiceURL?: string;
  localServiceURL?: string;
  derivedResources?: [DerivedResource];
  message?: string;
}

interface AppInstanceList extends TypeMeta {
  metadata?: ListMeta;
  items: AppInstance[];
}

function createAppInstanceType(name: string, template: string, publicService: string, inputs: Record<string, any> | null): AppInstance {
  let inputYaml = ""
  if (inputs != null) {
    inputYaml = encodeYaml(inputs)
  }
  return {
    apiVersion: "app.openapp.dev/v1alpha1",
    kind: "AppInstance",
    metadata: {
      name: name,
      namespace: "openapp",
      toJSON: function () {
      },
      validate: function (): void {
      }
    },
    spec: {
      appTemplate: template,
      inputs: inputYaml,
      publicServiceClass: publicService === "No exposure" ? "" : publicService,
    },
  };
}

export type {
  AppInstance,
  AppInstanceList,
  AppInstanceSpec,
  AppInstanceStatus,
};

export { createAppInstanceType };