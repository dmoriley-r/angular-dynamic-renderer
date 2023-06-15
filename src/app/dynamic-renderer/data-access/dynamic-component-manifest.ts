import { Type } from '@angular/core';
import {
  DynamicComponent,
  DynamicModule,
  DynamicRenderItem,
} from '../feature/render-template.types';

type ComponentMap = {
  [name: string]: {
    loadComponent: () => Promise<DynamicRenderItem>;
  };
};

const _dynamicComponentMap: ComponentMap = {
  pageContainer: {
    loadComponent: () =>
      import('../../dynamic-components/page-container').then(
        (m) => m.PageContainerModule as Type<DynamicModule>
      ),
  },
  pageSection: {
    loadComponent: () =>
      import('../../dynamic-components/page-section').then(
        (m) => m.PageSectionModule as Type<DynamicModule>
      ),
  },
  postPreview: {
    loadComponent: () =>
      import('../../dynamic-components/post-preview').then(
        (m) => m.PostPreviewComponent as Type<DynamicComponent>
      ),
  },
  textContainer: {
    loadComponent: () =>
      import('../../dynamic-components/text-container').then(
        (c) => c.TextContainerComponent as Type<DynamicComponent>
      ),
  },
  imgContainer: {
    loadComponent: () =>
      import('../../dynamic-components/img-container').then(
        (m) => m.ImgContainerModule as Type<DynamicModule>
      ),
  },
};

// TODO change this to a map and only export this instead of the above object
export const dynamicComponentMap = new Map(
  Object.entries(_dynamicComponentMap)
);
