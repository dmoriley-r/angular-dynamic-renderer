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

// Keys used internally by angular on definition classes
// can be used to determine what a class is before its processed
const NG_MOD_DEF_KEY = 'ɵmod';
const NG_COMP_DEF_KEY = 'ɵcmp';
// directive
// const NG_DIR_DEF_KEY =  'ɵdir'
// pipe
// const NG_PIPE_DEF_KEY = 'ɵpipe'
// factory
// const NG_FACTORY_DEF_KEY = 'ɵfac'

/** Type guard and function to determine if a object is an NgModule definition */
export function isModuleDefinition(
  item: DynamicRenderItem
): item is Type<DynamicModule> {
  return !!(item as any)[NG_MOD_DEF_KEY];
}

/** Type guard and function to determine if an object is an Component definition  */
export function isComponentDefinition(
  item: DynamicRenderItem
): item is Type<DynamicComponent> {
  return !!(item as any)[NG_COMP_DEF_KEY];
}
export interface LoadedRenderItems {
  renderItemRef: LoadedRenderItem;
  componentTemplate: ComponentTemplate;
}
