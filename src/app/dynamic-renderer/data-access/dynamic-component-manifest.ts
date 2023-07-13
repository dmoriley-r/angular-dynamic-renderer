import { Type } from '@angular/core';
import {
  DynamicComponent,
  DynamicModule,
  DynamicItemConstructor,
} from '../feature/render-template.types';

type ComponentMap = {
  [name: string]: {
    loadComponent: () => Promise<DynamicItemConstructor>;
  };
};

const _dynamicComponentMap: ComponentMap = {
  pageContainer: {
    loadComponent: () =>
      import('../../dynamic-components/page-container').then(
        (m) => m.PageContainerModule
      ),
  },
  pageSection: {
    loadComponent: () =>
      import('../../dynamic-components/page-section').then(
        (m) => m.PageSectionModule
      ),
  },
  postPreview: {
    loadComponent: () =>
      import('../../dynamic-components/post-preview').then(
        (m) => m.PostPreviewComponent
      ),
  },
  textContainer: {
    loadComponent: () =>
      import('../../dynamic-components/text-container').then(
        (c) => c.TextContainerComponent
      ),
  },
  imgContainer: {
    loadComponent: () =>
      import('../../dynamic-components/img-container').then(
        (m) => m.ImgContainerModule
      ),
  },
};

export const dynamicComponentMap = new Map(
  Object.entries(_dynamicComponentMap)
);
