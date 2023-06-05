import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { PageHeaderService } from 'src/app/layout/data-access/page-header.service';
import { CommonModule } from '@angular/common';
import { DynamicTemplatesModule } from 'src/app/dynamic-renderer/feature/dynamic-templates.module';

@NgModule({
  imports: [CommonModule, DynamicTemplatesModule],
  exports: [HomeComponent],
  declarations: [HomeComponent],
  providers: [PageHeaderService],
})
export class HomeModule {}
