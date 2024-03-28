import { DerivedResource } from "./common";
import {
  ObjectMeta,
  ListMeta,
} from "@kubernetes-models/apimachinery/apis/meta/v1";
import { TypeMeta } from "@kubernetes-models/base";
interface AppInstance extends TypeMeta {
  metadata: ObjectMeta;
  spec: AppInstanceSpec;
  status: AppInstanceStatus;
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

export type {
  AppInstance,
  AppInstanceList,
  AppInstanceSpec,
  AppInstanceStatus,
};
