import { addDoc, collection, CollectionReference, doc, DocumentData, DocumentReference, DocumentSnapshot, Firestore, FirestoreDataConverter, getDoc, getDocs, setDoc, SnapshotOptions } from 'firebase/firestore';
import { News } from '@models/news';
import { Category } from '@models/types/categories';
import { NewsProvider } from '../interfaces/news.provider';

interface FirestoreNews {
  title: string;
  authorID: string;
  description: string;
  content: string;
  image: string;
  categories: string[];
  usersCommentsID: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const newsConverter: FirestoreDataConverter<News, FirestoreNews> = {
  toFirestore: (news: News) => {
    return {
      title: news.title,
      authorID: news.authorID,
      description: news.description,
      content: news.content,
      usersCommentsID: news.usersCommentsID,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
    } as FirestoreNews;
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options)! as FirestoreNews;
    return {
      title: data.title,
      authorID: data.authorID,
      description: data.description,
      content: data.content,
      usersCommentsID: data.usersCommentsID,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    } as News;
  },
};

export class NewsFirebaseProviderServiceService implements NewsProvider {
  private readonly db: Firestore;
  private readonly posts: CollectionReference<News>;

  constructor(db: Firestore) {
    this.db = db;
    this.posts = collection(this.db, '/news').withConverter(newsConverter);
  }

  async addNews(news: News): Promise<string> {
    return (await addDoc(this.posts, news)).id;
  }

  async getAllNews(): Promise<News[]> {
    const snapshot = await getDocs(this.posts);
    snapshot.docs.forEach((doc) => console.log('Document data:', doc.data())); // Log each document's data
    const news: News[] = snapshot.docs.map((doc) => doc.data());
    return news;
  }

  getNewsByCategory(category: Category): Promise<News[]> {
    throw new Error('Category Method not implemented Yet.');
  }

  async getNewsById(id: string): Promise<News> {
    return (await getDoc(doc(this.posts, id))).data() as News;
  }
}