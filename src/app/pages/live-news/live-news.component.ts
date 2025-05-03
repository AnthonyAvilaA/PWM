import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { NewsService } from '@services/core/news.service';
import { LiveNewsModel, LiveNewsContentItem } from '@models/live-news.model';

// Interface for displaying feed items
interface LiveNewsItem {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  category: string;
  isBreaking: boolean;
  source?: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  description: string;
  time: Date;
}

@Component({
  selector: 'app-live-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-news.component.html',
  styleUrls: ['./live-news.component.css']
})
export class LiveNewsComponent implements OnInit, OnDestroy {
  // Loading and error states
  isLoading: boolean = true;
  hasError: boolean = false;

  // Live status
  isLive: boolean = false;
  lastUpdated: Date = new Date();

  // Breaking news ticker
  breakingNews: string | null = null;

  // Feed data
  liveFeedItems: LiveNewsItem[] = [];
  currentFilter: string = 'all';

  // Sidebar data
  trendingTopics: string[] = [];
  upcomingEvents: UpcomingEvent[] = [];

  // Subscription to manage real-time updates
  private updateSubscription?: Subscription;

  constructor(private newsService: NewsService) { }

  ngOnInit(): void {
    this.loadInitialData();

    // Simulate real-time updates every 30 seconds
    this.updateSubscription = interval(30000).subscribe(() => {
      this.fetchLiveNews();
    });
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  loadInitialData(): void {
    // Fetch real live news data
    this.fetchLiveNews();

    // Set sidebar data (still using mock data)
    this.trendingTopics = [
      'Climate Summit', 'Economy', 'Tech News', 'Sports Finals', 'Elections'
    ];

    this.upcomingEvents = [
      {
        id: '1',
        title: 'Presidential Press Conference',
        description: 'Live coverage of the President\'s monthly press briefing',
        time: new Date(new Date().getTime() + 3600000) // 1 hour from now
      },
      {
        id: '2',
        title: 'Champions League Final',
        description: 'Live commentary and updates from the big match',
        time: new Date(new Date().getTime() + 7200000) // 2 hours from now
      },
      {
        id: '3',
        title: 'Tech Company Earnings Call',
        description: 'Financial results and forecasts for the quarter',
        time: new Date(new Date().getTime() + 10800000) // 3 hours from now
      }
    ];
  }

  fetchLiveNews(): void {
    this.isLoading = true;
    this.hasError = false;

    this.newsService.getLiveNews().subscribe({
      next: (liveNewsItems: LiveNewsModel[]) => {
        this.isLoading = false;

        if (liveNewsItems && liveNewsItems.length > 0) {
          this.isLive = true;
          this.lastUpdated = new Date();

          // Get the first live news item (or use the most recent one if needed)
          const liveNews = liveNewsItems[0];

          // Set breaking news ticker from the title
          this.breakingNews = liveNews.title;

          // Reset feed items
          this.liveFeedItems = [];

          // Create a feed item for each content item
          if (liveNews.content && liveNews.content.length > 0) {
            liveNews.content.forEach((contentItem: LiveNewsContentItem, index) => {
              // Create a feed item for this content item
              const feedItem: LiveNewsItem = {
                id: `${liveNews.ID}-${index}`,
                title: contentItem.title,
                description: contentItem.description,
                timestamp: contentItem.timestamp,
                category: liveNews.categories[0] || 'general', // Use first category or default
                isBreaking: index === 0, // First update is breaking news
                source: 'News Network' // Placeholder source
              };

              this.liveFeedItems.push(feedItem);
            });

            // Sort by most recent first based on the timestamps in the content items
            this.liveFeedItems.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
          }
        } else {
          this.isLive = false;
          this.liveFeedItems = [];
        }
      },
      error: (err) => {
        console.error('Error loading live news:', err);
        this.isLoading = false;
        this.hasError = true;
        this.isLive = false;
      }
    });
  }

  retryConnection(): void {
    this.fetchLiveNews();
  }

  filterFeed(category: string): void {
    this.currentFilter = category;
    // In a real app, this would filter the news feed based on category
  }

  filterByTopic(topic: string): void {
    // In a real app, this would filter news by the selected topic
    console.log(`Filtering by topic: ${topic}`);
  }
}
