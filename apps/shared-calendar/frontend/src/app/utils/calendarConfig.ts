import { CalendarOptions } from '@fullcalendar/core';
import frLocale from '@fullcalendar/core/locales/fr';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { Calendar } from '@fullcalendar/core';


export const calendarConfig: CalendarOptions = {
  plugins: [dayGridPlugin, listPlugin, interactionPlugin],
  locale: frLocale,
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next',
    center: 'title',
    right: 'today'
  },
  titleFormat: { 
    year: 'numeric', 
    month: 'long'
  },
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
};