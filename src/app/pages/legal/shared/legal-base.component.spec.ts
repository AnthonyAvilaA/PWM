import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LegalBaseComponent } from './legal-base.component';

describe('LegalBaseComponent', () => {
  let component: LegalBaseComponent;
  let fixture: ComponentFixture<LegalBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalBaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LegalBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const testTitle = 'Test Legal Page';
    component.pageTitle = testTitle;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(testTitle);
  });

  it('should render sections', () => {
    component.sections = [
      { title: 'Test Section', content: 'Test content' }
    ];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('1. Test Section');
    expect(compiled.querySelector('p')?.innerHTML).toContain('Test content');
  });
});
