import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { News }   from '@models/news';

@Component({
  selector: 'app-article',
  imports: [RouterLink, CommonModule],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent {
  @Input() news: News | null = null;
}
