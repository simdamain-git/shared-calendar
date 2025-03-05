import { EventType } from "../enum/event-type";
import { RepetitionType } from "../enum/repetition-type";

export class Event {
  // Propriétés
  id: string;
  title: string;
  description?: string;
  start: Date;
  end?: Date;
  allDay?: boolean;
  groupId?: string;
  visibility: 'private' | 'group';
  type: EventType;
  repetition: RepetitionType;
  customRepetition?: string;
  userId: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: { [key: string]: any };

  // Constructeur
  constructor(data: Partial<Event>) {
    Object.assign(this, data);
    const id = data.id ?? (data as any)['_id'];
    this.setId(id);
    this.start = data.start ? new Date(data.start) : null;
    this.end = data.end ? new Date(data.end) : null;
    this.type = data.type ? this.mapEventType(data.type) : null;
    this.repetition = data.repetition ? this.mapRepetitionType(data.repetition) : null;
    this.setColorByType();
  }

  getId(): string {
    return this.id;
  }

  setId(id: string) {
    this.id = id;
  }

  // Méthodes essentielles (CRUD et opérations de base)
  update(data: Partial<Event>): void {
    Object.assign(this, data);
  }

  clone(): Event {
    return new Event({ ...this });
  }

  // Méthodes de calcul et de vérification
  getDuration(): number {
    if (this.end && this.start) {
      return (this.end.getTime() - this.start.getTime()) / (1000 * 60);
    }
    return 0;
  }

  overlaps(otherEvent: Event): boolean {
    return this.start < otherEvent.end && this.end > otherEvent.start;
  }

  isPast(): boolean {
    return this.end ? this.end < new Date() : this.start < new Date();
  }

  // Méthodes de formatage et d'affichage
  private mapEventType(type: string): EventType {
    switch (type) {
      case 'event': return EventType.EVENT;
      case 'task': return EventType.TASK;
      case 'birthday': return EventType.BIRTHDAY;
      default: return EventType.EVENT;
    }
  }

  private mapRepetitionType(repetition: string): RepetitionType {
    switch (repetition) {
      case 'once': return RepetitionType.ONCE;
      case 'daily': return RepetitionType.DAILY;
      case 'weekly': return RepetitionType.WEEKLY;
      case 'monthly': return RepetitionType.MONTHLY;
      case 'custom': return RepetitionType.CUSTOM;
      default: return RepetitionType.ONCE;
    }
  }

  getFormattedStartDate(): string {
    return this.start.toLocaleString();
  }

  private setColorByType(): void {
    if (this.type === null) {
      this.backgroundColor = '#CCCCCC';
      this.borderColor = '#999999';
      this.textColor = '#000000';
      return;
    }

    switch (this.type) {
      case EventType.EVENT:
        this.backgroundColor = '#4CAF50';
        this.borderColor = '#45a049';
        this.textColor = '#FFFFFF';
        break;
      case EventType.TASK:
        this.backgroundColor = '#2196F3';
        this.borderColor = '#1e88e5';
        this.textColor = '#FFFFFF';
        break;
      case EventType.BIRTHDAY:
        this.backgroundColor = '#FF9800';
        this.borderColor = '#f57c00';
        this.textColor = '#000000';
        break;
      default:
        this.backgroundColor = '#CCCCCC';
        this.borderColor = '#999999';
        this.textColor = '#000000';
    }
  }

  // Méthodes utilitaires ou helpers
  static createAllDayEvent(title: string, date: Date, type: EventType, userId: string): Event {
    return new Event({
      title,
      start: date,
      allDay: true,
      type,
      repetition: RepetitionType.NONE,
      userId
    });
  }
}