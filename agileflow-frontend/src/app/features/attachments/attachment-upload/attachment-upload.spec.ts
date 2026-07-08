import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentUpload } from './attachment-upload';

describe('AttachmentUpload', () => {
  let component: AttachmentUpload;
  let fixture: ComponentFixture<AttachmentUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentUpload],
      providers: [provideHttpClient(), provideRouter([])]})
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
