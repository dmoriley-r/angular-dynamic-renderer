import { NgModule } from '@angular/core';

import {
  PostPreviewComponent,
  componentDataResolver,
} from './post-preview.component';
import { DynamicModule } from 'src/app/dynamic-renderer/feature/render-template.types';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule],
  exports: [PostPreviewComponent],
  declarations: [PostPreviewComponent],
  providers: [],
})
export class PostPreviewModule implements DynamicModule {
  entry = PostPreviewComponent;
  componentDataResolver = componentDataResolver;
}
