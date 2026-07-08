import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentList } from './attachment-list';

describe('AttachmentList', () => {
  let component: AttachmentList;
  let fixture: ComponentFixture<AttachmentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentList],
      providers: [provideHttpClient(), provideRouter([])]})
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
