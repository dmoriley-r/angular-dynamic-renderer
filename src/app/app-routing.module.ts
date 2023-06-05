import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/feature/home.component';
import { routeDataResolver } from './shared';
import { PostComponent } from './posts/feature/post.component';
import { NotFoundComponent } from './not-found/feature/not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    resolve: { pageData: routeDataResolver },
  },
  {
    path: 'post',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'post/:id',
    component: PostComponent,
    resolve: { pageData: routeDataResolver },
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
