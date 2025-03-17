import { Component, OnInit, AfterViewInit, ViewChild, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import { DateClickArg } from '@fullcalendar/interaction/index.js';
import { CalendarService } from '../../../services/calendar.service';
import { Event } from '../../../models/event';
import { ScrollingModule } from '@angular/cdk/scrolling';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {DateUtils} from '../../../utils/dateUtils';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FullCalendarModule,
    ScrollingModule
  ]
})
export class AgendaComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  @ViewChildren('dateGroup') dateGroups: QueryList<ElementRef>;
  public calendarOptions: CalendarOptions;
  public groups: any[] = [];
  public selectedDate: Date | null = null;

  constructor(
    private calendarService: CalendarService,
    private alertController: AlertController,
    private router: Router
  ) {
    this.selectedDate = new Date();
  }

  ngOnInit() {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      events: (info, successCallback, failureCallback) => {
        this.calendarService.getEvents().subscribe(
          (events: Event[]) => {
            successCallback(events);
          },
          error => {
            failureCallback(error);
          }
        );
      }
    };
    this.loadEvents();
  }

  handleDateClick(arg: DateClickArg) {
    this.selectedDate = arg.date;
    this.scrollToSelectedDate();
  }

  handleEventClick(info: any) {
    this.selectedDate = info.event.start;
    this.scrollToSelectedDate();
  }

  scrollToSelectedDate() {
    if (!this.selectedDate) return;
    let dateGroupElement = this.dateGroups.find(group => {
      const dateHeader = group.nativeElement.querySelector('.date-header');
      return dateHeader && DateUtils.compareDates(new Date(dateHeader.textContent), this.selectedDate);
    });
    if (!dateGroupElement) {
      const futureDates = this.dateGroups.map(group => {
        const dateHeader = group.nativeElement.querySelector('.date-header');
        return new Date(dateHeader.textContent);
      });
      const closestFutureDate = DateUtils.findClosestFutureDate(futureDates, this.selectedDate);
      dateGroupElement = this.dateGroups.find(group => {
        const dateHeader = group.nativeElement.querySelector('.date-header');
        return dateHeader && DateUtils.compareDates(new Date(dateHeader.textContent),closestFutureDate);
      });
    }

    if (dateGroupElement) {
      dateGroupElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  loadEvents() {
    this.calendarService.getEvents().subscribe(
      (events: Event[]) => {
        this.groups = this.groupEventsByDate(events);
        this.scrollToSelectedDate();
      },
      error => {
        console.error('Erreur lors du chargement des événements', error);
      }
    );
  }

  groupEventsByDate(events: Event[]): { date: Date; events: Event[] }[] {
    const grouped = events.reduce((acc: any, event) => {
      const dateKey = new Date(event.start).toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {});
    return Object.entries(grouped).map(([dateString, events]) => ({
      date: new Date(dateString),
      events: events as Event[]
    })).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  trackByEvent(index: number, event: Event): string {
    return event.id; // Assuming _id is unique for each event
  }

  editEvent(event: Event) {
    this.router.navigateByUrl('agenda/form/' + (event as any)['_id']);
  }

  confirmDeleteEvent(event: Event) {
    this.alertController.create({
      header: 'Confirmer la suppression',
      message: 'Êtes-vous sûr de vouloir supprimer cet événement ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Supprimer',
          handler: () => {
            this.deleteEvent(event);
          }
        }
      ]
    });
  }

  deleteEvent(event: Event) {
    this.calendarService.deleteEvent(event.id).subscribe(
      () => {
        this.groups = this.groups.map(group => ({
          ...group,
          events: group.events.filter((e: Event) => e.id !== event.id)
        }));
        const calendarApi = this.calendarComponent.getApi();
        const calendarEvent = calendarApi.getEventById(event.id);
        if (calendarEvent) {
          calendarEvent.remove();
        }
      },
      (error) => console.error('Error deleting event', error)
    );
  }
}
