import { NgModule } from '@angular/core';

import { RenderTemplateComponent } from './render-template.component';
import { DynamicComponentsService } from '../data-access/dynamic-component.service';

@NgModule({
  imports: [],
  exports: [RenderTemplateComponent],
  declarations: [RenderTemplateComponent],
  providers: [DynamicComponentsService],
})
export class DynamicTemplatesModule {}
