import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { NotesListComponent } from './pages/notes-list/notes-list.component';
import { NoteEditComponent } from './pages/note-edit/note-edit.component';
import { PageMainComponent } from './pages/page-main/page-main.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: '', component: PageMainComponent, children: [
        { path: 'notes', component: NotesListComponent },
    { path: 'note-edit/:id', component: NoteEditComponent },
    ]},
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];
