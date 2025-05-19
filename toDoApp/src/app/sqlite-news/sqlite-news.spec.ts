import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SqliteNews } from './sqlite-news';

describe('NewsPage', () => {
  let component: SqliteNews;
  let fixture: ComponentFixture<SqliteNews>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SqliteNews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
