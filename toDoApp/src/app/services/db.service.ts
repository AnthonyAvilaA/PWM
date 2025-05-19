import { Injectable } from "@angular/core";
import { Capacitor } from "@capacitor/core";
import { SQLiteConnection, SQLiteDBConnection, CapacitorSQLite } from "@capacitor-community/sqlite";
import { AuthService } from "./firebase/auth.service";
import { News } from "../models/news";
import { User } from "../models/user";

export interface NewsInterface {
  id: number;
  newsID: string;
  news: News;
  user: User
}

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private sqlite!: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private platform!: 'native' | 'web';
  private email: string = '';

  constructor(
    private authService: AuthService,
  ) {
    this.initializeSQLite();
    this.authService.currentUser$.subscribe(user => {
      this.email = (user?.email || '').replace(/[^a-zA-Z0-9_]/g, '');
    });
  }


  private async initializeSQLite() {
    this.platform = Capacitor.getPlatform() === 'web' ? 'web' : 'native';
    if (this.platform === 'native') {
      this.sqlite = new SQLiteConnection(CapacitorSQLite);
    }
  }

  private initLocalStorageIfEmpty() {
    const data = localStorage.getItem(this.email);
    if (!data) {
      localStorage.setItem(this.email, JSON.stringify([]));
    }
  }

  private getLocalNews(): NewsInterface[] {
    const data = localStorage.getItem(this.email);
    return data ? JSON.parse(data) : [];
  }

  private setLocalNews(news: NewsInterface[]) {
    localStorage.setItem(this.email, JSON.stringify(news));
  }

  // -------- DB INIT --------
  private async createSQLiteConnection(): Promise<void> {
    if (this.platform === 'web') {
      return;
    }

    if (!this.sqlite) {
      throw new Error('SQLiteConnection is not initialized.');
    }

    if (!this.db) {
      this.db = await this.sqlite.createConnection('data.db', false, 'no-encryption', 1, false);
      await this.db.open();
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS ${this.email} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        newsID TEXT,
        title TEXT,
        description TEXT,
        content TEXT,
        image TEXT,
        name TEXT,
        image_url TEXT,);
      `);
    }
  }

  // -------- CRUD (WEB + NATIVE) --------
  async getAllNews(): Promise<NewsInterface[]> {
    if (!this.checkIfLoged()) {
      return [];
    }
    if (this.platform === 'web') {
      this.initLocalStorageIfEmpty();
      console.log('Local Storage:', this.getLocalNews());
      return this.getLocalNews();
    }
    await this.createSQLiteConnection();
    const result = await this.db!.query(`SELECT * FROM ${this.email}`);
    return result.values?.map(result => (
      {
        id: result.values[0],
        newsID: result.values[1],
        news: {
          title: result.values[2],
          description: result.values[3],
          content: result.values[4],  
          image: result.values[5],
        },
        user: {
          name: result.values[6],
          image_url: result.values[7],
        }
      })as NewsInterface
    ) || [];
  }

  async addNews(newsID: string, news: News, user: User): Promise<NewsInterface[]> {
    if (!this.checkIfLoged()) {
      return [];
    }
    if (this.platform === 'web') {
      this.initLocalStorageIfEmpty();
      const local_news = this.getLocalNews();
      const newNews: NewsInterface = { id: Date.now(), newsID, news, user};
      local_news.push(newNews);
      this.setLocalNews(local_news);
      return local_news;
    }
    await this.createSQLiteConnection();
    await this.db!.run(`INSERT INTO ${this.email} (newsID) VALUES (?, ?, ?, ?, ?, ?, ?)`, [newsID, news.title, news.description, news.content, news.image, user.name, user.image_url]);
    return this.getAllNews();
  }

  async deleteNews(id: string): Promise<NewsInterface[]> {
    if (!this.checkIfLoged()) {
      return [];
    }
    if (this.platform === 'web') {
      this.initLocalStorageIfEmpty();
      const news = this.getLocalNews().filter(news => news.newsID !== id);
      this.setLocalNews(news);
      return news;
    }
    await this.createSQLiteConnection();
    await this.db!.run(`DELETE FROM ${this.email} WHERE newsID = ?`, [id]);
    return this.getAllNews();
  }

  checkIfLoged() {
    console.log('User:', this.email);
    if (this.email == "") {
      return false;
    }
    return true;
  }
}