import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteEditComponent } from './note-edit.component';

describe('NoteEditComponent', () => {
  let component: NoteEditComponent;
  let fixture: ComponentFixture<NoteEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
