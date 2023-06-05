import {
  Injectable,
  Injector,
  ViewContainerRef,
  createNgModule,
} from '@angular/core';
import {
  dynamicComponentKeysSet,
  dynamicComponentMap,
} from './dynamic-component-manifest';
import {
  ComponentTemplate,
  LoadedComponentModules,
} from '../feature/render-template.types';

@Injectable({ providedIn: 'root' })
export class DynamicComponentsService {
  constructor(public injector: Injector) {}

  loadComponentModule(componentMapName: string) {
    dynamicComponentMap;
    return dynamicComponentMap[componentMapName].loadModule().then((module) => {
      if (!module) {
        throw new Error(`Module not found for: ${componentMapName};`);
      }
      return createNgModule<typeof module>(module as any, this.injector);
    });
  }

  createComponent(
    container: ViewContainerRef,
    componentTemplate: ComponentTemplate,
    moduleRef: LoadedComponentModules['moduleRef']
  ) {
    // check resolver function exists and execute it
    const resolverData =
      moduleRef.instance.componentDataResolver &&
      moduleRef.instance.componentDataResolver(
        componentTemplate.componentData || {}
      );
    const componentRef = container.createComponent(moduleRef.instance.entry, {
      ngModuleRef: moduleRef,
    });

    // if resolver data found apply to the component
    if (resolverData) {
      Object.keys(resolverData).forEach(
        (key) => (componentRef.instance[key] = resolverData[key])
      );
    }

    container.insert(componentRef.hostView);
    return componentRef;
  }

  checkComponentMap(componentData: any, environment: string): boolean {
    if (
      !dynamicComponentKeysSet.has(componentData.name) &&
      environment !== 'prod'
    ) {
      console.error(
        `----- Component name "${componentData.name}" does not exist.`
      );
    }

    return (
      Boolean(componentData) &&
      Boolean(componentData.name) &&
      dynamicComponentKeysSet.has(componentData.name)
    );
  }
}
