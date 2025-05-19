import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from "../components/header/header.component";
import { IonicModule } from '@ionic/angular';
import { DbService, NewsInterface } from '../services/db.service';
import { addIcons } from 'ionicons';

import { bookmark } from 'ionicons/icons';
import { bookmarkOutline } from 'ionicons/icons';
import { AuthService } from '../services/firebase/auth.service';

addIcons({
  'bookmark': bookmark,
  'bookmark-outline': bookmarkOutline
})


@Component({
  selector: 'ionic-app-news',
  templateUrl: './sqlite-news.html',
  styleUrls: ['./sqlite-news.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent],
})
export class SqliteNews implements OnInit {
  newsID: string = '';
  newsData!: NewsInterface;
  saveState: boolean = false;
  newsSaved: NewsInterface[] = [];

  constructor(
    private dbService: DbService,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) { }

  async ngOnInit() {
    this.authService.currentUser$.subscribe(async user => {
      if (user) {
        this.newsID = this.route.snapshot.paramMap.get('id') || '';
        this.newsData = (await this.dbService.getAllNews()).find((news) => news.newsID === this.newsID)!;
      }
    })
  };

  async ionViewWillEnter() {
    this.newsSaved = await this.dbService.getAllNews();
    this.saveState = this.newsSaved.some((save) => save.newsID === this.newsID);
  }

  getContent(content: string): string {
    return content.replace(/<p>/g, '') // Eliminar todas las etiquetas <p>
      .replace(/<\/p>/g, '\n\n'); // Reemplazar </p> con un salto de línea
  }

  getDate(ts: { seconds: number, nanoseconds: number }): Date {
    return new Date(ts.seconds * 1000 + Math.floor(ts.nanoseconds / 1e6));
  }

}