import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { NotesListComponent } from './pages/notes-list/notes-list.component';
import { NoteEditComponent } from './pages/note-edit/note-edit.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'notes', component: NotesListComponent },
    { path: 'notes', component: NoteEditComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];
