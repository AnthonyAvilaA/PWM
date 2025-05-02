import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsModel } from '@models/news.model';

@Component({
  selector: 'app-side-article',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './side-article.component.html',
  styleUrls: ['./side-article.component.css']
})
export class SideArticleComponent {
  @Input() news: NewsModel | null = null;
}
