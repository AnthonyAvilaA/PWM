import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewsModel } from '@models/news.model';

@Component({
  selector: 'app-article',
  imports: [RouterLink, CommonModule],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent implements OnInit {
  @Input() news: NewsModel | null = null;

  ngOnInit(): void {
    if (this.news?.updatedAt && (this.news.updatedAt as any).seconds) {
      // Convert Firestore Timestamp to JavaScript Date
      const timestamp = this.news.updatedAt as any; // Cast to handle Firestore Timestamp
      this.news.updatedAt = new Date(timestamp.seconds * 1000);
    }
  }
}
