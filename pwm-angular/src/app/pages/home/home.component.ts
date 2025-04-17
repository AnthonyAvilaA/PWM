import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleComponent} from "@components/article/article.component";
import { SideArticleComponent} from '@components/side-article/side-article.component';
import { NewsService } from '@services/news.service';
import { News } from '@models/news';


@Component({
  selector: 'app-home',
  imports: [ArticleComponent, SideArticleComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  // News collections
  topStories: News[] = [];
  suggestedContent: News[] = [];
  liveNews: News | null = null;

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

    // Get latest news with reset pagination (true means reset)
    this.newsService.getLatestNews(this.pageSize, true).subscribe({
      next: (news) => {
        if (news.length === 0) {
          this.noMoreNews = true;
          this.loading = false;
          return;
        }

        // Split news between top stories and suggested content
        const allNews = [...news];

        // Set aside one article for "live news" if available
        if (allNews.length > 0) {
          this.liveNews = allNews.shift() || null;
          if (this.liveNews) {
            this.loadedNewsIds.add(this.liveNews.ID);
          }
        }

        // Populate top stories and suggested content
        this.distributeNews(allNews);

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
  private distributeNews(newsItems: News[]): void {
    // Use 2/3 for top stories and 1/3 for suggested content
    const topCount = Math.ceil(newsItems.length * 0.67);

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

}
