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

export type DynamicComponentConstructor = Type<DynamicComponent>;
export type DynamicModuleConstructor = Type<DynamicModule>;

export type DynamicItemConstructor =
  | DynamicModuleConstructor
  | DynamicComponentConstructor;

export type LoadedRenderItem =
  | NgModuleRef<DynamicModule>
  | DynamicComponentConstructor;

// Keys used internally by angular on definition classes
// can be used to determine what a constructor function is before its processed
const NG_MOD_DEF_KEY = 'ɵmod';
const NG_COMP_DEF_KEY = 'ɵcmp';
// directive
// const NG_DIR_DEF_KEY =  'ɵdir'
// pipe
// const NG_PIPE_DEF_KEY = 'ɵpipe'
// factory
// const NG_FACTORY_DEF_KEY = 'ɵfac'

/** Type guard and function to determine if a constructor function is for an NgModule */
export function isModuleConstructor(
  item: any
): item is DynamicModuleConstructor {
  return !!(item as any)[NG_MOD_DEF_KEY];
}

/** Type guard and function to determine if a constructor function is for an NgComponent  */
export function isComponentConstructor(
  item: any
): item is DynamicComponentConstructor {
  return !!(item as any)[NG_COMP_DEF_KEY];
}
export interface LoadedRenderItems {
  renderItemRef: LoadedRenderItem;
  componentTemplate: ComponentTemplate;
}
