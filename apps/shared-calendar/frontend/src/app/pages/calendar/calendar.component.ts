import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Event } from '../../models/event';
import { FullCalendarModule } from '@fullcalendar/angular';
import { calendarConfig } from '../../utils/calendarConfig';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

  constructor() {
  }
}
