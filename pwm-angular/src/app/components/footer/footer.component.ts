import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: true
})
export class FooterComponent {
  email: string = '';
  subscribed: boolean = false;

  onSubscribe(): void {
    // Simulate subscription process
    if (this.email) {
      console.log('Subscribed with email:', this.email);
      this.subscribed = true;
      this.email = '';
    }
  }

  resetForm(): void {
    this.subscribed = false;
  }
}
