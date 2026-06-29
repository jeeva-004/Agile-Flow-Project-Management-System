import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintEdit } from './sprint-edit';

describe('SprintEdit', () => {
  let component: SprintEdit;
  let fixture: ComponentFixture<SprintEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SprintEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SprintEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
