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

export const dynamicComponentMap: ComponentMap = {
  pageContainer: {
    loadComponent: () =>
      import('../../dynamic-components/page-container').then(
        (m) => m.PageContainerModule as unknown as Type<DynamicModule>
      ),
  },
  pageSection: {
    loadComponent: () =>
      import('../../dynamic-components/page-section').then(
        (m) => m.PageSectionModule as unknown as Type<DynamicModule>
      ),
  },
  postPreview: {
    loadComponent: () =>
      import('../../dynamic-components/post-preview').then(
        (m) => m.PostPreviewModule as unknown as Type<DynamicModule>
      ),
  },
  textContainer: {
    loadComponent: () =>
      import('../../dynamic-components/text-container').then(
        (c) => c.TextContainerComponent as unknown as Type<DynamicComponent>
      ),
  },
  imgContainer: {
    loadComponent: () =>
      import('../../dynamic-components/img-container').then(
        (m) => m.ImgContainerModule as unknown as Type<DynamicModule>
      ),
  },
};

export const dynamicComponentKeysSet = new Set(
  Object.keys(dynamicComponentMap)
);
