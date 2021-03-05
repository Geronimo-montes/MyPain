import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyPaintComponent } from './pages/my-paint/my-paint.component';

const routes: Routes = [
  {
    path: 'mypaint',
    component: MyPaintComponent,
  }, {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'mypaint'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
