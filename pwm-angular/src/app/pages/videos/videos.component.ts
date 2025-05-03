import { Component, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoData } from '@models/video.model';
import { VideoService } from '@services/core/video.service';


@Component({
  selector: 'app-videos',
  imports: [NgIf],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.css',
  standalone: true
})
export class VideosComponent implements OnInit {
  videos: VideoData[] = [];
  mainVideo!: VideoData | null;
  trustedVideoUrl!: SafeResourceUrl;
  loading: boolean = true;
  error: string | null = null;
  categories: { [category: string]: VideoData[] } = {
    tecnología: [],
    politica: [],
    otros: []
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
          this.videos.pop();
          this.trustedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.mainVideo.video_url);
        }

        //Group remaining videos by category
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
}
