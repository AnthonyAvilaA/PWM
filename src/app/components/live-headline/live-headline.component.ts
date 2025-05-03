import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { LiveNewsModel } from '@models/live-news.model';

@Component({
  selector: 'app-live-headline',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './live-headline.component.html',
  styleUrls: ['./live-headline.component.css']
})
export class LiveHeadlineComponent{
  @Input() liveNews: LiveNewsModel | null = null;
  @Input() link: string = '/';  // Default to home if nothing is passed
}
