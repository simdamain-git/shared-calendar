import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { Event } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private apiUrl = environment.API_URL + 'events';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl).pipe(
      map(events => events.map(event => new Event({
        id: event.id,
        title: event.title,
        description: event.description,
        start: new Date(event.start),
        end: event.end ? new Date(event.end) : undefined,
        groupId: event.groupId,
        visibility: event.visibility,
        type: event.type,
        repetition: event.repetition,
        userId: event.userId,
        backgroundColor: event.backgroundColor,
        borderColor: event.borderColor,
        textColor: event.textColor,
        extendedProps: event.extendedProps
      })))
    );
  }

  getEvent(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`).pipe(
      map(event => new Event({
        id: event.id,
        title: event.title,
        description: event.description,
        start: new Date(event.start),
        end: event.end ? new Date(event.end) : undefined,
        groupId: event.groupId,
        visibility: event.visibility,
        type: event.type,
        repetition: event.repetition,
        userId: event.userId,
        backgroundColor: event.backgroundColor,
        borderColor: event.borderColor,
        textColor: event.textColor,
        extendedProps: event.extendedProps
      }))
    );
  }

  addEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event).pipe(
      map(newEvent => new Event({
        id: newEvent.id,
        title: newEvent.title,
        description: newEvent.description,
        start: new Date(newEvent.start),
        end: newEvent.end ? new Date(newEvent.end) : undefined,
        groupId: newEvent.groupId,
        visibility: newEvent.visibility,
        type: newEvent.type,
        repetition: newEvent.repetition,
        userId: newEvent.userId,
        backgroundColor: newEvent.backgroundColor,
        borderColor: newEvent.borderColor,
        textColor: newEvent.textColor,
        extendedProps: newEvent.extendedProps
      }))
    );
  }

  updateEvent(event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${event.id}`, event).pipe(
      map(updatedEvent => new Event({
        id: updatedEvent.id,
        title: updatedEvent.title,
        description: updatedEvent.description,
        start: new Date(updatedEvent.start),
        end: updatedEvent.end ? new Date(updatedEvent.end) : undefined,
        groupId: updatedEvent.groupId,
        visibility: updatedEvent.visibility,
        type: updatedEvent.type,
        repetition: updatedEvent.repetition,
        userId: updatedEvent.userId,
        backgroundColor: updatedEvent.backgroundColor,
        borderColor: updatedEvent.borderColor,
        textColor: updatedEvent.textColor,
        extendedProps: updatedEvent.extendedProps
      }))
    );
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}