import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideArticleComponent } from './side-article.component';

describe('SideArticleComponent', () => {
  let component: SideArticleComponent;
  let fixture: ComponentFixture<SideArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideArticleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
