import {
  ComponentRef,
  Injectable,
  Injector,
  NgModuleRef,
  ViewContainerRef,
  createNgModule,
} from '@angular/core';
import {
  ComponentTemplate,
  DynamicModule,
  LoadedRenderItem,
  isDynamicModule,
} from '../feature/render-template.types';
import { dynamicComponentMap } from './dynamic-component-manifest';

@Injectable({ providedIn: 'root' })
export class DynamicComponentsService {
  constructor(public injector: Injector) {}

  async loadComponentInfo(name: string) {
    const loadedComponent = await dynamicComponentMap
      .get(name)!
      .loadComponent();

    if (!loadedComponent) {
      throw new Error(`Component not found for: ${name};`);
    }
    if (isDynamicModule(loadedComponent)) {
      return createNgModule<DynamicModule>(loadedComponent, this.injector);
    } else {
      // stand alone component
      return loadedComponent;
    }
  }

  createComponent(
    container: ViewContainerRef,
    componentTemplate: ComponentTemplate,
    renderItem: LoadedRenderItem
  ) {
    let componentRef: ComponentRef<any>;
    let resolverData: any;

    if (renderItem instanceof NgModuleRef) {
      resolverData =
        renderItem.instance.componentDataResolver &&
        renderItem.instance.componentDataResolver(
          componentTemplate.componentData || {}
        );
      componentRef = container.createComponent(renderItem.instance.entry, {
        ngModuleRef: renderItem,
      });
      // if resolver data found apply to the component
    } else {
      componentRef = container.createComponent(renderItem);
      resolverData =
        componentRef.instance.componentDataResolver &&
        componentRef.instance.componentDataResolver(
          componentTemplate.componentData || {}
        );
    }

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
      !dynamicComponentMap.has(componentData.name) &&
      environment !== 'prod'
    ) {
      console.error(
        `----- Component name "${componentData.name}" does not exist.`
      );
    }

    return (
      Boolean(componentData) &&
      Boolean(componentData.name) &&
      dynamicComponentMap.has(componentData.name)
    );
  }
}
