import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DynamicModule } from 'src/app/dynamic-renderer/feature/render-template.types';
import {
  TextContainerComponent,
  componentDataResolver,
} from './text-container.component';

@NgModule({
  imports: [CommonModule],
  exports: [TextContainerComponent],
  declarations: [TextContainerComponent],
  providers: [],
})
export class TextContainerModule implements DynamicModule {
  entry = TextContainerComponent;
  componentDataResolver = componentDataResolver;
}
