import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaffAskerComponent } from './maff-asker/maff-asker.component';

const routes: Routes = [
  {
    path: "",
    component: MaffAskerComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
