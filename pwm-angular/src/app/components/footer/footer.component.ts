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
  emailError: string = '';

  constructor(private translate: TranslateService) {}

  validateEmail(): void {
    if (!this.email) {
      this.emailError = 'FOOTER.EMAIL_REQUIRED';
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      this.emailError = 'FOOTER.EMAIL_INVALID';
    } else {
      this.emailError = '';
    }
  }

  onSubscribe(): void {
    this.validateEmail();
    
    if (!this.emailError) {
      // Here you would typically send the email to your backend service
      console.log('Subscribing email:', this.email);
      this.subscribed = true;
      this.email = '';
    }
  }

  resetForm(): void {
    this.email = '';
    this.subscribed = false;
    this.emailError = '';
  }
}
