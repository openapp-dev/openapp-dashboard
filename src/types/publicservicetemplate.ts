import {
  ObjectMeta,
  ListMeta,
} from "@kubernetes-models/apimachinery/apis/meta/v1";
import { TypeMeta } from "@kubernetes-models/base";
import { ExposeType } from "./common";

interface PublicServiceTemplate extends TypeMeta {
  metadata?: ObjectMeta;
  spec: PublicServiceTemplateSpec;
}

interface PublicServiceTemplateSpec {
  title: string;
  description: string;
  author: string;
  icon: string;
  url: string;
  inputs: string;
  exposeTypes: ExposeType[];
}

interface PublicServiceTemplateList extends TypeMeta {
  metadata?: ListMeta;
  items: PublicServiceTemplate[];
}

export type {
  PublicServiceTemplate,
  PublicServiceTemplateList,
  PublicServiceTemplateSpec,
};
