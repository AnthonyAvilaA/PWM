import { Injectable } from '@angular/core';
import { NewsProvider } from './providers/interfaces/news.provider';
import { NewsFirebaseProviderServiceService } from './providers/firebase/news.firebase.provider.service.service';
import { db } from 'environments/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class NewsProviderServiceService {
  
  //public newsProvider: NewsProvider = new NewsFirebaseProviderServiceService(db);
  public newsProvider: NewsProvider = new NewsFirebaseProviderServiceService(db);
}
