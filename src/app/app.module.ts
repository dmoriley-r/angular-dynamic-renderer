import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DynamicTemplatesModule } from './dynamic-renderer/feature/dynamic-templates.module';
import { LayoutComponent } from './layout/feature/layout.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeModule } from './home';
import { PostModule } from './posts';
import { NotFoundModule } from './not-found';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DynamicTemplatesModule,
    HttpClientModule,
    LayoutComponent,
    HomeModule,
    PostModule,
    NotFoundModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
