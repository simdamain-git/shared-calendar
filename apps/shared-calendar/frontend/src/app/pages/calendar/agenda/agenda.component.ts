import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { calendarConfig } from '../../../utils/calendarConfig';
import { CalendarService } from '../../../services/calendar.service';
import { Event } from '../../../models/event';
import { Router } from '@angular/router';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; 
import listPlugin from '@fullcalendar/list';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [IonicModule, CommonModule, FullCalendarModule],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss',
})
export class AgendaComponent implements OnInit, AfterViewInit{
  calendarOptions = calendarConfig;
  groups: { date: Date; events: Event[] }[] = [];

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  constructor(private calendarService: CalendarService, private router: Router, private alertController: AlertController) {
    
  }

  ngOnInit() {
    this.loadEvents();
  }

  ngAfterViewInit() {
    this.setCalendarHeight();
  }

  setCalendarHeight() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.setOption('height', 450);
  }

  loadEvents() {
    this.calendarService.getEvents().subscribe(
      (events: Event[]) => {
        console.log('load');
        this.groups = this.groupEventsByDate(events);
        this.calendarOptions.events = events.map((event) => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
        }));
      },
      (error) => console.error('Error loading events', error)
    );
  }
  
  editEvent(event: Event) {
      this.router.navigateByUrl('agenda/form/' + (event as any)['_id']);
    }

    async confirmDeleteEvent(event: Event) {
      const alert = await this.alertController.create({
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
  
      await alert.present();
    }
  
    deleteEvent(event: Event) {
      this.calendarService.deleteEvent(event.id).subscribe(
        () => {
          this.groups = this.groups.map(group => ({
            ...group,
            events: group.events.filter(e => e.id !== event.id)
          }));
          const calendarApi = this.calendarComponent.getApi();
          const calendarEvent = calendarApi.getEventById(event.id);
          if (calendarEvent) {
            calendarEvent.remove();
          }
          this.loadEvents();
        },
        (error) => console.error('Error deleting event', error)
      );
    }

    groupEventsByDate(events: Event[]): { date: Date; events: Event[] }[] {
      const now = new Date();
    
      // Filtrer les événements futurs ou en cours
      const filteredEvents = events.filter(event => {
        console.log(event);
        console.log(new Date(event.start) <= now);
        console.log(new Date(event.end) >= now);
        console.log(new Date(event.start) <= now && new Date(event.end) >= now);
        return new Date(event.start) <= now && new Date(event.end) >= now
    });
    
      const grouped = filteredEvents.reduce((acc: any, event) => {
        const dateKey = event.start.toDateString();
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
}
