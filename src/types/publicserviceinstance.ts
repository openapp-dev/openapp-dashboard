import { DerivedResource } from "./common";
import {
  ObjectMeta,
  ListMeta,
} from "@kubernetes-models/apimachinery/apis/meta/v1";
import { TypeMeta } from "@kubernetes-models/base";
interface PublicServiceInstance extends TypeMeta {
  metadata?: ObjectMeta;
  spec: PublicServiceInstanceSpec;
  status: PublicServiceInstanceStatus;
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

export type {
  PublicServiceInstance,
  PublicServiceInstanceList,
  PublicServiceInstanceSpec,
  PublicServiceInstanceStatus,
};
