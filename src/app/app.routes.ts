import { Routes } from '@angular/router';
import { PeopleListComponent } from './components/people/people-list/people-list.component';
import { AddPersonComponent } from './components/people/add-person/add-person.component';
import { EditPersonComponent } from './components/people/edit-person/edit-person.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'people',
    pathMatch: 'full'
  },
  {
    path: 'people',
    component: PeopleListComponent
  },
  {
    path: 'people/add',
    component: AddPersonComponent
  },
  {
    path: 'people/edit/:id',
    component: EditPersonComponent
  },
  {
    path: '**',
    redirectTo: 'people'
  }
];
