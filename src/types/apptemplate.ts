import {
  ObjectMeta,
  ListMeta,
} from "@kubernetes-models/apimachinery/apis/meta/v1";
import { TypeMeta } from "@kubernetes-models/base";
import { ExposeType } from "./common";

interface AppTemplate extends TypeMeta {
  metadata: ObjectMeta;
  spec: AppTemplateSpec;
}

interface AppTemplateSpec {
  title: string;
  description: string;
  author: string;
  icon: string;
  url: string;
  inputs: string;
  exposeType: ExposeType;
}

interface AppTemplateList extends TypeMeta {
  metadata?: ListMeta;
  items: AppTemplate[];
}

export type { AppTemplate, AppTemplateList, AppTemplateSpec };
