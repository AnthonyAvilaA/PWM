import { ComponentFixture, TestBed } from '@angular/core/testing';

import { savedNews } from './saved-news';

describe('HomePage', () => {
  let component: savedNews;
  let fixture: ComponentFixture<savedNews>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(savedNews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
