import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoData } from '@models/video.model';
import { VideoService } from '@services/core/video.service';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-videos',
  imports: [CommonModule, TranslateModule],
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css'],
  standalone: true
})
export class VideosComponent implements OnInit {
  videos: VideoData[] = [];
  mainVideo!: VideoData | null;
  trustedVideoUrl!: SafeResourceUrl;
  loading: boolean = true;
  error: string | null = null;
  
  // Categories with pagination control
  categories: { [category: string]: VideoData[] } = {
    tecnología: [],
    politica: [],
    otros: []
  };
  
  // Active page index for each category
  categoryPage: { [category: string]: number } = {
    tecnología: 0,
    politica: 0,
    otros: 0
  };

  constructor(private sanitizer: DomSanitizer,
              private videoService: VideoService) {}

  ngOnInit() {
    this.loadVideos();
  }

  loadVideos() {
    this.loading = true;
    this.error = null;
    
    this.videoService.getVideos().subscribe({
      next: (data) => {
        this.videos = data.data;

        // Set the main video (first in the array)
        if (this.videos.length > 0) {
          this.mainVideo = this.videos[0];
          this.trustedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.mainVideo.video_url);
          
          // Remove the main video from the list
          this.videos = this.videos.slice(1);
        }

        // Group remaining videos by category
        this.videos.forEach(video => {
          if (this.categories[video.category]) {
            this.categories[video.category].push(video);
          } else {
            // If the category doesn't exist in predefined, add to otros
            this.categories['otros'].push(video);
          }
        });
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading videos:', err);
        this.error = 'Error al cargar los videos. Por favor intente más tarde.';
        this.loading = false;
      }
    });
  }

  // Navigate to next page in category
  nextPage(category: string) {
    const maxPage = Math.ceil(this.categories[category].length / 2) - 1;
    if (this.categoryPage[category] < maxPage) {
      this.categoryPage[category]++;
    }
  }

  // Navigate to previous page in category
  prevPage(category: string) {
    if (this.categoryPage[category] > 0) {
      this.categoryPage[category]--;
    }
  }

  // Get current videos for category based on pagination
  getCurrentVideos(category: string): VideoData[] {
    const startIndex = this.categoryPage[category] * 2;
    return this.categories[category].slice(startIndex, startIndex + 2);
  }

  // Check if has next page
  hasNextPage(category: string): boolean {
    const maxPage = Math.ceil(this.categories[category].length / 2) - 1;
    return this.categoryPage[category] < maxPage;
  }

  // Check if has previous page
  hasPrevPage(category: string): boolean {
    return this.categoryPage[category] > 0;
  }

  // Create trusted URL
  getTrustedUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
