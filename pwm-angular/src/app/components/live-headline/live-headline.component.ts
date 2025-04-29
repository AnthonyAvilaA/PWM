import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-live-headline',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './live-headline.component.html',
  styleUrl: './live-headline.component.css'
})
export class LiveHeadlineComponent{
  @Input() liveNews: any;
  @Input() link: string = '/';  // Default to home if nothing is passed

}
