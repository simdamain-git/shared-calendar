import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NoteService } from '../../services/note.service';
import { Router } from '@angular/router';
import { Note } from '../../models/note';
import { Observable, of } from 'rxjs';



@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class NotesListComponent implements OnInit {
  public notes$: Observable<Note[]> = new Observable();
  constructor(private noteService: NoteService, private router: Router) {
    this.notes$ = of([]);
    this.noteService.currentNote = null;
  }

  ngOnInit() {
    this.notes$ = this.noteService.getNotes();
  }

  addNote() {
    this.noteService.currentNote = null;
    this.router.navigateByUrl('/note-edit/new');
  }

  editNote(note: Note) {
    this.noteService.currentNote = note
    this.router.navigateByUrl(`/note-edit/${note.id}`);
  }
}