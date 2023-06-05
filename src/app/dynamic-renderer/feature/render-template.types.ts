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

export type DynamicModule = {
  entry: Type<any>;
  componentDataResolver: (data: ComponentData) => any;
};

export interface LoadedComponentModules {
  moduleRef: NgModuleRef<DynamicModule>;
  componentTemplate: ComponentTemplate;
}
