import { NgModule } from '@angular/core';

import {
  PageContainerComponent,
  componentDataResolver,
} from './page-container.component';
import { DynamicTemplatesModule } from 'src/app/dynamic-renderer/feature/dynamic-templates.module';
import { DynamicModule } from 'src/app/dynamic-renderer/feature/render-template.types';

@NgModule({
  imports: [DynamicTemplatesModule],
  exports: [PageContainerComponent],
  declarations: [PageContainerComponent],
  providers: [],
})
export class PageContainerModule implements DynamicModule {
  entry = PageContainerComponent;
  componentDataResolver = componentDataResolver;
}
