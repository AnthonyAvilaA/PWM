import { Component } from '@angular/core';
import { LegalBaseComponent, LegalSection } from '../shared/legal-base.component';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [LegalBaseComponent],
  template: `<app-legal-base
    [pageTitle]="pageTitle"
    [lastUpdate]="lastUpdate"
    [sections]="sections"
    [contactEmail]="contactEmail">
  </app-legal-base>`,
})
export class TermsComponent {
  pageTitle = 'Términos y Condiciones';
  lastUpdate = new Date("2025-03-30");
  contactEmail = 'argonynews@legal.com';

  sections: LegalSection[] = [
    {
      title: 'Aceptación de los términos',
      content: 'Al acceder y usar este sitio web, aceptas cumplir con estos términos y condiciones.'
    },
    {
      title: 'Uso del sitio',
      content: 'Está prohibido el uso del sitio para actividades ilegales o no autorizadas.'
    },
    {
      title: 'Contenido',
      content: 'El contenido del sitio es solo para fines informativos y no garantiza exactitud absoluta.'
    },
    {
      title: 'Responsabilidad',
      content: 'No somos responsables de daños derivados del uso del sitio.'
    },
    {
      title: 'Modificaciones',
      content: 'Nos reservamos el derecho de modificar estos términos en cualquier momento.'
    }
  ];
}
