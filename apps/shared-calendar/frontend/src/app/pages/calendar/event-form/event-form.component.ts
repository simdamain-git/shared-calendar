import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Event } from '../../../models/event';
import { EventType } from '../../../enum/event-type';
import { RepetitionType } from '../../../enum/repetition-type';
import { ReactiveFormsModule } from '@angular/forms';
import { InputDateComponent } from "../../../components/input-date/input-date.component";
import { CalendarService } from '../../../services/calendar.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule, InputDateComponent],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss'
})
export class EventFormComponent {
  eventForm: FormGroup;
  eventTypes = Object.values(EventType);
  repetitionTypes = Object.values(RepetitionType);

  constructor(
    private formBuilder: FormBuilder,
    private calendarService: CalendarService,
    private router: Router, 
    private route: ActivatedRoute) {

    }

  ngOnInit() {
      const eventId = this.route.snapshot.paramMap.get('id');
      if (eventId && eventId !== 'new') {
        this.loadEvent(eventId);
      } else {
        this.initializeForm();
      }
  }

  loadEvent(id: string) {
    this.calendarService.getEvent(id).subscribe(
      (event: Event) => {
        this.eventForm = this.formBuilder.group({
          id: [event.id],
          title: [event.title, Validators.required],
          description: [event.description],
          start: [event.start.toISOString(), Validators.required],
          end: [event.end ? event.end.toISOString() : null],
          allDay: [event.allDay],
          type: [event.type, Validators.required],
          repetition: [event.repetition, Validators.required],
          userId: [event.userId]
        });        
      },
      (error: any) => console.error('Error loading event', error)
    );
  }
  
  initializeForm() {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  
    this.eventForm = this.formBuilder.group({
      id: [null],
      title: ['', Validators.required],
      description: [''],
      start: [now.toISOString(), Validators.required],
      end: [oneHourLater.toISOString()],
      allDay: [false],
      type: [EventType.EVENT, Validators.required],
      repetition: [RepetitionType.NONE, Validators.required],
      userId: ['currentUserId']
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const eventData = new Event(this.eventForm.value);
      const operation = eventData.id ? 
        this.calendarService.updateEvent(eventData) : 
        this.calendarService.addEvent(eventData);
      operation.subscribe(
        () => {
          window.location.href = 'agenda/calendar';
        },
        error => console.error('Error saving event', error)
      );
    }
  }
  
}
