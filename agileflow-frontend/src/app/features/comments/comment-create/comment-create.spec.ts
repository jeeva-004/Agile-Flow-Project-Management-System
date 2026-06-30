import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentCreate } from './comment-create';

describe('CommentCreate', () => {
  let component: CommentCreate;
  let fixture: ComponentFixture<CommentCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
