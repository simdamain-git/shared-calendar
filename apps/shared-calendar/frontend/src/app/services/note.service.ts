import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { Note } from '../models/note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private apiUrl = environment.API_URL + 'notes';
  private notesSubject = new BehaviorSubject<Note[]>([]);

  notes$ = this.notesSubject.asObservable();

  currentNote: Note;

  constructor(private http: HttpClient) {}

  getNotes(): Observable<Note[]> {
    return this.http.get<{ error: string | null; notes: Note[] }>(this.apiUrl).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.error);
        }        
        return response.notes.map((note: any) => new Note(
          note._id,
          note.title,
          note.content,
          note.groupId,
          note.visibility,
          new Date(note.createdAt),
          new Date(note.updatedAt)
        ));
      })
    );
  }

  getNote(id: string): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/${id}`).pipe(
      map((note: any) => new Note(
        note._id,
        note.title,
        note.content,
        note.groupId,
        note.visibility,
        new Date(note.createdAt),
        new Date(note.updatedAt)
      ))
    );
  }

  addNote(note: Note): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, note).pipe(
      map((newNote: any) => new Note(
        newNote._id,
        newNote.title,
        newNote.content,
        newNote.groupId,
        newNote.visibility,
        new Date(newNote.createdAt),
        new Date(newNote.updatedAt)
      ))
    );
  }

  updateNote(note: Note): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/${note.id}`, note).pipe(
      map((updatedNote: any) => new Note(
        updatedNote._id,
        updatedNote.title,
        updatedNote.content,
        updatedNote.groupId,
        updatedNote.visibility,
        new Date(updatedNote.createdAt),
        new Date(updatedNote.updatedAt)
      ))
    );
  }

  deleteNote(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  refreshNotes() {
    this.getNotes().subscribe(notes => this.notesSubject.next(notes));
  }
}