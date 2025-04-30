import { Component, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoData } from '@models/video';
import { VideoService } from '@services/video.service';


@Component({
  selector: 'app-videos',
  imports: [NgIf],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.css'
})
export class VideosComponent implements OnInit {
  videos: VideoData[] = [];
  mainVideo!: VideoData | null;
  trustedVideoUrl!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer,
              private videoService: VideoService) {}

  ngOnInit() {
    this.loadVideos();
  }

  loadVideos() {
    this.videoService.getVideos().subscribe({
      next: (data) => {
        this.videos = data.data;

      if (this.videos.length > 0) {
        this.mainVideo = this.videos[0];
        this.videos.pop();
        this.trustedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.mainVideo.video_url);
      }
    },
      error: (error) => {
        console.error('Error al obtener los videos:', error);
      }
    });
  }
}
