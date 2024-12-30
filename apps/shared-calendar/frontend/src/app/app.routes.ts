import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { NoteEditComponent } from './pages/note-edit/note-edit.component';
import { NotesListComponent } from './pages/notes-list/notes-list.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guard/auth.guard';
import { GroupManagementComponent } from './pages/group-management/group-management.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', component: MainComponent, canActivate: [authGuard],children: [
        { path: 'notes', component: NotesListComponent },
        { path: 'notes-edit/:id', component: NoteEditComponent },
        { path: 'group', component: GroupManagementComponent },
        { path: '', redirectTo: 'notes', pathMatch: 'full' }
    ]},
];
