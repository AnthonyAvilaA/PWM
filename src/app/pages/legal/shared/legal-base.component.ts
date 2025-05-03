import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LegalSection {
  title: string;
  content: string;
}

@Component({
  selector: 'app-legal-base',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legal-base.component.html',
  styleUrl: './legal-base.component.css'
})
export class LegalBaseComponent {
  @Input() pageTitle = '';
  @Input() lastUpdate: Date = new Date();
  @Input() sections: LegalSection[] = [];
  @Input() contactEmail = 'correo@ejemplo.com';
}
