import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DynamicTemplatesModule } from 'src/app/dynamic-renderer/feature/dynamic-templates.module';
import { DynamicModule } from 'src/app/dynamic-renderer/feature/render-template.types';
import {
  PageSectionComponent,
  componentDataResolver,
} from './page-section.component';

@NgModule({
  imports: [DynamicTemplatesModule, CommonModule],
  exports: [PageSectionComponent],
  declarations: [PageSectionComponent],
  providers: [],
})
export class PageSectionModule implements DynamicModule {
  entry = PageSectionComponent;
  componentDataResolver = componentDataResolver;
}
