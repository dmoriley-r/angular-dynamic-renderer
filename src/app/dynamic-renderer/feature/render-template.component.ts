import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DynamicComponentsService } from '../data-access/dynamic-component.service';
import { isFulfilled } from '../utils/utils';
import { ComponentTemplate, LoadedRenderItems } from './render-template.types';

@Component({
  selector: 'app-render-template',
  template: ` <ng-template #container></ng-template> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderTemplateComponent implements AfterViewInit {
  @Input({ required: true }) components: ComponentTemplate[];
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  private componentRefs: ComponentRef<any>[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private dynamicComponentsService: DynamicComponentsService
  ) {}

  ngOnDestroy() {
    this.componentRefs.forEach((ref) => ref.destroy());
    if (this.container) {
      this.container.clear();
    }
  }

  ngAfterViewInit() {
    if (!this.container || !this.components || this.components.length === 0) {
      return;
    }

    this.componentRefs.forEach((ref) => ref.destroy()); // clear all refs

    const loadedComponentModules = this.components
      .filter((componentData) =>
        this.dynamicComponentsService.checkComponentMap(componentData, 'dev')
      )
      .map(async (componentTemplate) => {
        const itemRef =
          await this.dynamicComponentsService.loadComponentConstructor(
            componentTemplate.name
          );
        return { renderItemRef: itemRef, componentTemplate };
      });

    this.container?.clear(); // clear the container that holds the components
    this.renderComponents(loadedComponentModules);
  }

  async renderComponents(items: Promise<LoadedRenderItems>[]) {
    const allSettledItems = await Promise.allSettled(items);
    for (let item of allSettledItems) {
      if (isFulfilled(item)) {
        const newComponent = this.dynamicComponentsService.createComponent(
          this.container,
          item.value.componentTemplate,
          item.value.renderItemRef
        );
        if (newComponent) {
          this.componentRefs.push(newComponent);
        }
      } else {
        // is rejected
        console.error(item.reason);
      }
    }
    this.cdr.markForCheck();
  }
}
