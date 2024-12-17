import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../services/note.service';
import { Note } from '../../models/note';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-note-edit',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './note-edit.component.html',
  styleUrl: './note-edit.component.scss'
})
export class NoteEditComponent {
  public note: Note;
  isNewNote = true;

  constructor(private route: ActivatedRoute, private noteService: NoteService, private router: Router) {
    this.note = null;
    
  }

  ngOnInit() {
    this.isNewNote = this.route.snapshot.paramMap.get('id') === 'new';    
    this.note = this.noteService.currentNote ?? new Note();
  }

  saveNote() {
    console.log(this.isNewNote);
    const obs = this.isNewNote ? this.noteService.addNote(this.note) : this.noteService.updateNote(this.note);
    obs.subscribe(result => {
      console.log('Note sauvegardée:', this.note);
      this.router.navigateByUrl('notes');
    })
    
  }
}
