import { NgModule } from '@angular/core';

import { PostComponent } from './post.component';
import { DynamicTemplatesModule } from 'src/app/dynamic-renderer/feature/dynamic-templates.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [DynamicTemplatesModule, CommonModule],
  exports: [PostComponent],
  declarations: [PostComponent],
  providers: [],
})
export class PostModule {}
