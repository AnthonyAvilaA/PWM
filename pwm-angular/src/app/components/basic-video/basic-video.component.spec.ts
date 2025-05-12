import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicVideoComponent } from './basic-video.component';

describe('BasicVideoComponent', () => {
  let component: BasicVideoComponent;
  let fixture: ComponentFixture<BasicVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
