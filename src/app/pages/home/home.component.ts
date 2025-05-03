import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleComponent} from "@components/article/article.component";
import { SideArticleComponent} from '@components/side-article/side-article.component';
import { NewsService } from '@services/core/news.service';
import { NewsModel } from '@models/news.model';
import { LiveHeadlineComponent } from '@components/live-headline/live-headline.component';
import { LiveNewsModel } from '@models/live-news.model';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ArticleComponent, SideArticleComponent, CommonModule, LiveHeadlineComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // News collections
  topStories: NewsModel[] = [];
  suggestedContent: NewsModel[] = [];
  liveNews: LiveNewsModel | null = null;

  // UI state
  loading = true;
  error: string | null = null;
  noMoreNews = false;

  // Pagination
  pageSize = 10; // Number of articles to load at once

  // Track all loaded news to avoid duplicates
  private loadedNewsIds: Set<string> = new Set();

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.loading = true;
    this.error = null;
    this.topStories = [];
    this.suggestedContent = [];
    this.loadedNewsIds.clear();
    this.noMoreNews = false;

    // Load both live news and regular news in parallel
    forkJoin({
      liveNews: this.newsService.getLiveNews(),
      regularNews: this.newsService.getLatestNews(this.pageSize, true)
    }).subscribe({
      next: (result) => {
        // Handle live news
        if (result.liveNews.length > 0) {
          this.liveNews = result.liveNews[0]; // Get the first live news item
        } else {
          this.liveNews = null;
        }

        // Handle regular news
        if (result.regularNews.length === 0) {
          this.noMoreNews = true;
          this.loading = false;
          return;
        }

        // Distribute regular news between top stories and suggested content
        this.distributeNews(result.regularNews);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading news:', err);
        this.error = 'Failed to load news. Please try again later.';
        this.loading = false;
      }
    });
  }

  loadMoreNews(): void {
    const originalTopStoriesLength = this.topStories.length;
    const originalSuggestedContentLength = this.suggestedContent.length;

    // false means don't reset pagination
    this.newsService.getLatestNews(this.pageSize, false).subscribe({
      next: (news) => {
        if (news.length === 0) {
          this.noMoreNews = true;
          return;
        }

        // Filter out any news items we've already loaded
        const newItems = news.filter(item => !this.loadedNewsIds.has(item.ID));

        if (newItems.length === 0) {
          this.noMoreNews = true;
          return;
        }

        // Add more news to the page
        this.distributeNews(newItems);

        // If no new items were added to either section, show "no more news"
        if (this.topStories.length === originalTopStoriesLength &&
          this.suggestedContent.length === originalSuggestedContentLength) {
          this.noMoreNews = true;
        }
      },
      error: (err) => {
        console.error('Error loading more news:', err);
        // Don't set the error state, just log it
      }
    });
  }

  /**
   * Distributes news items between top stories and suggested content
   */
  private distributeNews(newsItems: NewsModel[]): void {
    // Use 1/2 for top stories and 1/2 for suggested content
    const topCount = Math.ceil(newsItems.length * 0.5);

    // Get items for top stories
    for (let i = 0; i < topCount && i < newsItems.length; i++) {
      if (newsItems[i]) {
        this.topStories.push(newsItems[i]);
        this.loadedNewsIds.add(newsItems[i].ID);
      }
    }

    // Get items for suggested content
    for (let i = topCount; i < newsItems.length; i++) {
      if (newsItems[i]) {
        this.suggestedContent.push(newsItems[i]);
        this.loadedNewsIds.add(newsItems[i].ID);
      }
    }
  }
}
