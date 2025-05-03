import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveHeadlineComponent } from './live-headline.component';

describe('LiveHeadlineComponent', () => {
  let component: LiveHeadlineComponent;
  let fixture: ComponentFixture<LiveHeadlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveHeadlineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveHeadlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
