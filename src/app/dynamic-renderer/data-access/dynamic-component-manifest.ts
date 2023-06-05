import { DynamicModule } from '../feature/render-template.types';

type ComponentMap = {
  [name: string]: {
    loadModule: () => Promise<DynamicModule>;
  };
};

export const dynamicComponentMap: ComponentMap = {
  pageContainer: {
    loadModule: () =>
      import('../../dynamic-components/page-container').then(
        (m) => m.PageContainerModule as unknown as DynamicModule
      ),
  },
  pageSection: {
    loadModule: () =>
      import('../../dynamic-components/page-section').then(
        (m) => m.PageSectionModule as unknown as DynamicModule
      ),
  },
  postPreview: {
    loadModule: () =>
      import('../../dynamic-components/post-preview').then(
        (m) => m.PostPreviewModule as unknown as DynamicModule
      ),
  },
  textContainer: {
    loadModule: () =>
      import('../../dynamic-components/text-container').then(
        (m) => m.TextContainerModule as unknown as DynamicModule
      ),
  },
};

export const dynamicComponentKeysSet = new Set(
  Object.keys(dynamicComponentMap)
);
