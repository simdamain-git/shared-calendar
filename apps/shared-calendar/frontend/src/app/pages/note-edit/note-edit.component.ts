import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Group } from '../../models/group';
import { NoteService } from '../../services/note.service';
import { Note } from '../../models/note';
import { GroupService } from '../../services/group.service';


@Component({
  selector: 'app-note-edit',
  templateUrl: './note-edit.component.html',
  styleUrls: ['./note-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonicModule
  ]
})
export class NoteEditComponent implements OnInit {
  public noteForm: FormGroup;
  public groups: Group[];
  isNewNote = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private noteService: NoteService,
    private groupService: GroupService,
    private router: Router
  ) {
    this.groups = [];
  }

  ngOnInit() {
    this.isNewNote = this.route.snapshot.paramMap.get('id') === 'new';
    this.noteForm = this.fb.group({
      groupId: [null],
      title: ['', Validators.required],
      content: ['', Validators.required]
    });

    if (!this.isNewNote) {
      const currentNote = this.noteService.currentNote;
      if (currentNote) {
        this.noteForm.patchValue({
          groupId: currentNote.groupId,
          title: currentNote.title,
          content: currentNote.content
        });
      }
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
    if (this.noteForm.invalid) {
      return;
    }

    const noteData = new Note(
      this.isNewNote ? '' : this.noteService.currentNote.id,
      this.noteForm.value.title,
      this.noteForm.value.content,
      this.noteForm.value.groupId,
      'private', // or 'group' based on your logic
      new Date(),
      new Date()
    );

    const obs = this.isNewNote ? this.noteService.addNote(noteData) : this.noteService.updateNote(noteData);
    obs.subscribe(
      () => this.router.navigate(['/notes']),
      error => console.error('Erreur lors de la sauvegarde de la note', error)
    );
  }
}