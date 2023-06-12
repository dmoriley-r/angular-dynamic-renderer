import { NgModuleRef, Type } from '@angular/core';

export type ComponentData = {
  children?: ComponentTemplate[];
} & Partial<{
  [key: string]: any;
}>;

export interface ComponentTemplate {
  name: string;
  componentData: ComponentData;
}

export type DynamicComponent = {
  componentDataResolver: (data: ComponentData) => any;
};

export type DynamicModule = {
  entry: Type<any>;
} & DynamicComponent;

export type DynamicRenderItem = Type<DynamicModule> | Type<DynamicComponent>;
export type LoadedRenderItem =
  | NgModuleRef<DynamicModule>
  | Type<DynamicComponent>;

export function isDynamicModule(
  item: DynamicRenderItem
): item is Type<DynamicModule> {
  // maybe theres a better way to determine this
  return item.name.toLowerCase().includes('module');
}

export interface LoadedRenderItems {
  renderItemRef: LoadedRenderItem;
  componentTemplate: ComponentTemplate;
}
