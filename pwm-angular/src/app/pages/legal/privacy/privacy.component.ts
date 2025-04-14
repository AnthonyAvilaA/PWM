import { Component } from '@angular/core';
import { LegalBaseComponent, LegalSection } from '../shared/legal-base.component';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [LegalBaseComponent],
  template: `<app-legal-base
    [pageTitle]="pageTitle"
    [lastUpdate]="lastUpdate"
    [sections]="sections"
    [contactEmail]="contactEmail">
  </app-legal-base>`,
})
export class PrivacyComponent {
  pageTitle = 'Política de Privacidad';
  lastUpdate = new Date("2025-03-30");
  contactEmail = 'argonynews@legal.com';

  sections: LegalSection[] = [
    {
      title: 'Información que recopilamos',
      content: 'Recopilamos información personal y no personal cuando usas nuestro sitio web, como datos de navegación, cookies y cualquier información proporcionada voluntariamente.'
    },
    {
      title: 'Uso de la información',
      content: 'Usamos la información para mejorar la experiencia del usuario, analizar tráfico y ofrecer contenido personalizado.'
    },
    {
      title: 'Cookies',
      content: 'Utilizamos cookies para mejorar la funcionalidad del sitio. Puedes gestionar tus preferencias en la sección "Tus preferencias de privacidad".'
    },
    {
      title: 'Seguridad',
      content: 'Tomamos medidas para proteger tu información, pero no podemos garantizar seguridad absoluta en internet.'
    }
  ];
}
