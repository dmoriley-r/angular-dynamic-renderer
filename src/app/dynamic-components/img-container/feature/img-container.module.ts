import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DynamicModule } from 'src/app/dynamic-renderer/feature/render-template.types';
import {
  ImgContainerComponent,
  componentDataResolver,
} from './img-container.component';

@NgModule({
  imports: [CommonModule],
  exports: [ImgContainerComponent],
  declarations: [ImgContainerComponent],
  providers: [],
})
export class ImgContainerModule implements DynamicModule {
  entry = ImgContainerComponent;
  componentDataResolver = componentDataResolver;
}
