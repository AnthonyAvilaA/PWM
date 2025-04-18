import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { News } from '../../models/news';

@Component({
  selector: 'app-side-article',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './side-article.component.html',
  styleUrls: ['./side-article.component.css']
})
export class SideArticleComponent {
  @Input() news: News | null = null;
}
