import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonRouterOutlet } from '@ionic/angular/standalone';
import { NewsService } from '../services/firebase/news.service';
import { Observable } from 'rxjs';
import { News } from '../models/news';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { NewsPage } from '../news/news.page';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Timestamp } from 'firebase/firestore';
import { HeaderComponent } from "../components/header/header.component";
import { DbService, NewsInterface } from '../services/db.service';
import { addIcons } from 'ionicons';

import { bookmark } from 'ionicons/icons';
import { bookmarkOutline } from 'ionicons/icons';

addIcons({
  'bookmark': bookmark,
  'bookmark-outline': bookmarkOutline
})


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [RouterLink, IonicModule, CommonModule, HeaderComponent],
})
export class HomePage {
  news!: Observable<News[]>;
  private modalController = inject(ModalController);
  private routerOutlet = inject(IonRouterOutlet);
  savedNews: NewsInterface[] = [];

  constructor(
    private newsService: NewsService,
    private dbService: DbService
  ) { }

  async ngOnInit() {
    this.news = this.newsService.getNews();
    this.savedNews = await this.dbService.getAllNews();
  }

  async ionViewWillEnter() {
    this.savedNews = await this.dbService.getAllNews();
  }


  async openNewsModal() {
    const modal = await this.modalController.create({
      component: NewsPage,
      presentingElement: this.routerOutlet.nativeEl,
    });
    await modal.present();
  }

  getDate(date: Timestamp) {
    const seconds = date.seconds;
    const nanoseconds = date.nanoseconds;

    const millis = seconds * 1000 + Math.floor(nanoseconds / 1e6);
    const newDate = new Date(millis);

    return newDate.toDateString();
  }

  isSaved(id: string) {
    return this.savedNews.some((news) => String(news.newsID) == id);
  }
}
