import { DerivedResource } from "./common";
import {
  ObjectMeta,
  ListMeta,
} from "@kubernetes-models/apimachinery/apis/meta/v1";
import { TypeMeta } from "@kubernetes-models/base";
import { encodeYaml } from "../util/ymal";
interface PublicServiceInstance extends TypeMeta {
  metadata: ObjectMeta;
  spec: PublicServiceInstanceSpec;
  status?: PublicServiceInstanceStatus;
}

interface PublicServiceInstanceSpec {
  publicServiceTemplate: string;
  inputs: string;
}

interface PublicServiceInstanceStatus {
  publicServiceReady?: boolean;
  localServiceURL?: string;
  derivedResources?: [DerivedResource];
  message?: string;
}

interface PublicServiceInstanceList extends TypeMeta {
  metadata?: ListMeta;
  items: PublicServiceInstance[];
}

function createPublicServiceInstanceType(name: string, template: string, inputs: Record<string, any> | null): PublicServiceInstance {
  let inputYaml = ""
  if (inputs != null) {
    inputYaml = encodeYaml(inputs)
  }
  return {
    apiVersion: "service.openapp.dev/v1alpha1",
    kind: "PublicServiceInstance",
    metadata: {
      name: name,
      namespace: "openapp",
      toJSON: function () {
      },
      validate: function (): void {
      }
    },
    spec: {
      publicServiceTemplate: template,
      inputs: inputYaml,
    },
  };
}

export type {
  PublicServiceInstance,
  PublicServiceInstanceList,
  PublicServiceInstanceSpec,
  PublicServiceInstanceStatus,
};

export { createPublicServiceInstanceType };