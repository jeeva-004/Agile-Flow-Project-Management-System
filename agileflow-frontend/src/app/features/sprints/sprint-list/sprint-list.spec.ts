import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintList } from './sprint-list';

describe('SprintList', () => {
  let component: SprintList;
  let fixture: ComponentFixture<SprintList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SprintList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SprintList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
