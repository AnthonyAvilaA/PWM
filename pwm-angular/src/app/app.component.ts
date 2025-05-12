import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TitleService } from './services/core/title.service';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './services/core/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ArgonyNews';

  constructor(
    private titleService: TitleService,
    private translate: TranslateService,
    private themeService: ThemeService
  ) {
    // Initialize translations
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('es');

    // Get browser language or use default
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang?.match(/en|es/) ? browserLang : 'es');
  }

  ngOnInit(): void {
    // Initialize the title service to update titles on route changes
    this.titleService.initTitleService();
  }
}
