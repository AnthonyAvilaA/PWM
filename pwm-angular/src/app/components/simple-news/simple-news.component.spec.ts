import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleNewsComponent } from './simple-news.component';

describe('SimpleNewsComponent', () => {
  let component: SimpleNewsComponent;
  let fixture: ComponentFixture<SimpleNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleNewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
