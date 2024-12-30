import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../services/note.service';
import { GroupService } from '../../services/group.service';
import { Note } from '../../models/note';
import { Group } from '../../models/group';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-note-edit',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './note-edit.component.html',
  styleUrl: './note-edit.component.scss'
})
export class NoteEditComponent implements OnInit {
  public note: Note;
  public groups: Group[];
  isNewNote = true;

  constructor(
    private route: ActivatedRoute,
    private noteService: NoteService,
    private groupService: GroupService,
    private router: Router
  ) {
    this.note = new Note();
    this.groups = [];
  }

  ngOnInit() {
    this.isNewNote = this.route.snapshot.paramMap.get('id') === 'new';
    if (!this.isNewNote) {
      this.note = this.noteService.currentNote ?? new Note();
    }
    this.loadGroups();
  }

  loadGroups() {
    this.groupService.getGroups().subscribe(
      groups => this.groups = groups,
      error => console.error('Erreur lors du chargement des groupes', error)
    );
  }

  saveNote() {
    const obs = this.isNewNote ? this.noteService.addNote(this.note) : this.noteService.updateNote(this.note);
    obs.subscribe(
      result => {
        console.log('Note sauvegardée:', result);
        this.router.navigateByUrl('notes');
      },
      error => console.error('Erreur lors de la sauvegarde de la note', error)
    );
  }
}
