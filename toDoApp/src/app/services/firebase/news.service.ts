import { inject, Injectable } from '@angular/core';
import { collection, CollectionReference, doc, Firestore } from 'firebase/firestore';
import { collectionData, docData } from 'rxfire/firestore';
import { Observable } from 'rxjs';
import { News } from 'src/app/models/news';
import { db } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  firestore: Firestore = db;
  collectionNews: CollectionReference<News>;

  constructor() {
    this.collectionNews = collection(this.firestore, 'news') as CollectionReference<News>;
  }

  getNews(): Observable<News[]> { 
    return collectionData<News>(this.collectionNews, {idField: 'ID' }) as Observable<News[]>;
  }

  getNewsById(id: string): Observable<News> {
    const newsRef = collection(this.firestore, 'news') as CollectionReference<News>;
    const newsDoc = doc(newsRef, id);
    return docData(newsDoc, { idField: 'ID' }) as Observable<News>;
  }
}
