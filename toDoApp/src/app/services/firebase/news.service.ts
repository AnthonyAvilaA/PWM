import { inject, Injectable } from '@angular/core';
import { collection, CollectionReference, Firestore } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { Observable } from 'rxjs';
import { News } from 'src/app/models/news';
import { db } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private firestore: Firestore = db;
  collectionNews: any;

  constructor() {
    this.collectionNews = collection(this.firestore, 'news');
  }

  getNews(): Observable<News[]> { 
    return collectionData<News>(this.collectionNews, {idField: 'ID' }) as Observable<News[]>;
  }
}
