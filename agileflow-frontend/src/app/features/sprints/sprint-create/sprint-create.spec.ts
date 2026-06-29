import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintCreate } from './sprint-create';

describe('SprintCreate', () => {
  let component: SprintCreate;
  let fixture: ComponentFixture<SprintCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SprintCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SprintCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
