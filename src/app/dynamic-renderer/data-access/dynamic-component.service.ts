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
  isComponentConstructor,
  isModuleConstructor,
} from '../feature/render-template.types';
import { dynamicComponentMap } from './dynamic-component-manifest';

@Injectable({ providedIn: 'root' })
export class DynamicComponentsService {
  constructor(public injector: Injector) {}

  async loadComponentConstructor(name: string) {
    const loadedItem = dynamicComponentMap.get(name);

    if (!loadedItem) {
      throw new Error(`Component not found for: ${name};`);
    }

    const loadedComponentConstructor = await loadedItem.loadComponent();

    if (isModuleConstructor(loadedComponentConstructor)) {
      return createNgModule<DynamicModule>(
        loadedComponentConstructor,
        this.injector
      );
    } else {
      // stand alone component
      return loadedComponentConstructor;
    }
  }

  createComponent(
    container: ViewContainerRef,
    componentTemplate: ComponentTemplate,
    renderItem: LoadedRenderItem
  ) {
    let componentRef: ComponentRef<any>;
    let resolverData: any;

    if (!isComponentConstructor(renderItem)) {
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
