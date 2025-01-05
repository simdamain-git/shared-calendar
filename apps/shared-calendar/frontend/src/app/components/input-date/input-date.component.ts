import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
  IonDatetime,
  IonDatetimeButton,
  IonItem,
  IonLabel,
  IonModal,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

export const DATE_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputDateComponent),
  multi: true,
};

@Component({
  selector: 'app-input-date',
  providers: [DATE_CONTROL_VALUE_ACCESSOR],
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss'],
  standalone: true,
  imports: [
    IonDatetimeButton,
    IonItem,
    IonLabel,
    IonDatetime,
    IonModal,
    CommonModule,
    FormsModule,
    TranslateModule,
  ],
})
export class InputDateComponent implements ControlValueAccessor, OnInit {
  @Input() label?: string;

  public uniqueId: string;

  protected _value: string | null = null;
  protected isDisabled: boolean = false;
  constructor() {}

  ngOnInit(): void {
    this.uniqueId = 'datetime-' + Math.random().toString(36).substr(2, 9);
  }

  public get value(): string | null {
    return this._value;
  }
  public set value(value: string | null) {
    this.onTouched();
    this._value = value;
    this.onChanged(value);
  }

  protected onChanged: any = () => {};
  protected onTouched: any = () => {};

  writeValue(obj: any): void {
    // throw new Error('Method not implemented.');
    this._value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    // throw new Error('Method not implemented.');
    this.isDisabled = isDisabled;
  }

  notify() {
    this.onChanged(this._value);
  }
}
