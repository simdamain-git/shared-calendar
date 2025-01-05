import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guard/auth.guard';


export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', component: MainComponent, canActivate: [authGuard],children: [
        {
            path: 'notes',
            loadComponent: () => import('./pages/notes-list/notes-list.component').then((m) => m.NotesListComponent),
          },
          {
            path: 'notes-edit/:id',
            loadComponent: () => import('./pages/note-edit/note-edit.component').then((m) => m.NoteEditComponent),
          },
          {
            path: 'group',
            loadComponent: () => import('./pages/group-management/group-management.component').then((m) => m.GroupManagementComponent),
          },
          {
            path: 'agenda',
            loadComponent: () => import('./pages/calendar/calendar.component').then((m) => m.CalendarComponent), children: [
              { path: 'form/:id', loadComponent: () => import('./pages/calendar/event-form/event-form.component').then((m) => m.EventFormComponent) },
              { path: 'calendar', loadComponent: () => import('./pages/calendar/agenda/agenda.component').then((m) => m.AgendaComponent) },
              // { path: 'filter', loadComponent: () => import('./pages/calendar/filter/filter.component').then((m) => m.FilterComponent) }
            ],
          },
        { path: '', redirectTo: 'agenda/calendar', pathMatch: 'full' }
    ]},
];
