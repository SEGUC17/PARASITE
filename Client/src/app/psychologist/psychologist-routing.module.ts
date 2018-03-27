import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PsychologistComponent } from './psychologist/psychologist.component';
const routes = [
  { path: 'psychologist/:id', component: PsychologistComponent }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class PsychologistRoutingModule { }
