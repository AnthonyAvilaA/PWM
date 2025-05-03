import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, TranslateModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  email: string = '';
  subscribed: boolean = false;

  constructor(private translate: TranslateService) {}

  onSubscribe(): void {
    if (this.email && this.email.includes('@')) {
      // In a real application, this would send the email to a backend service
      console.log('Subscribing with email:', this.email);
      
      // Reset form and show success message
      this.subscribed = true;
    }
  }

  resetForm(): void {
    this.email = '';
    this.subscribed = false;
  }
}
