import { Injectable } from "@angular/core";
import { SQLiteConnection } from '@capacitor-community/sqlite'; // Ensure this is the correct library
import { SQLiteDBConnection } from '@capacitor-community/sqlite'; // Ensure this is the correct library

export interface NewsInterface {
  id: number;
  description: string;
  isDone: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class DbService {
  private sqlite!: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private platform!: 'native' | 'web';
  private localStorageKey = 'news';

  private initLocalStorageIfEmpty() {
    const data = localStorage.getItem(this.localStorageKey);
    if (!data)
      localStorage.setItem(this.localStorageKey, JSON.stringify([]));
  }

  private getLocalNews(): NewsInterface[] {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : [];
  }
  private setLocalNews(news: NewsInterface[]) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(news));
  }

  private async createSQLiteConnection(): Promise<void> {
    if (!this.db) {
      this.db =
        await this.sqlite.createConnection('data.db', false, 'no-encryption', 1, false);
      await this.db.open();
      await this.db.execute(`
      CREATE TABLE IF NOT EXISTS NEWS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT, isDone INTEGER );
      `);
    }
  }

  async getAllNews(): Promise<NewsInterface[]> {
    if (this.platform === 'web') {
      return this.getLocalNews();
    }
    await this.createSQLiteConnection();
    const result = await this.db!.query('SELECT * FROM NEWS');
    return result.values?.map(news => ({
      ...news,
      isDone: !!news.isDone
    })) || [];
  }

  async addNews(description: string): Promise<NewsInterface[]> {
    if (this.platform === 'web') {
      const news = this.getLocalNews();
      const newNews: NewsInterface =
        { id: Date.now(), description, isDone: false };
      news.push(newNews);
      this.setLocalNews(news);
      return news;
    }
    await this.createSQLiteConnection();
    await this.db!.run(
      'INSERT INTO NEWS (description, isDone) VALUES (?, ?)', [description, 0]);
    return this.getAllNews();
  }

  async updateNews(id: number): Promise<NewsInterface[]> {
    if (this.platform === 'web') {
      const news = this.getLocalNews().map(news =>
        news.id === id ? { ...news, isDone: true } : news);
      this.setLocalNews(news);
      return news;
    }
    await this.createSQLiteConnection();
    await this.db!.run('UPDATE NEWS SET isDone = 1 WHERE id = ?', [id]);
    return this.getAllNews();
  }
  
  async deleteNews(id: number): Promise<NewsInterface[]> {
    if (this.platform === 'web') {
      const news = this.getLocalNews().filter(news => news.id !== id);
      this.setLocalNews(news);
      return news;
    }
    await this.createSQLiteConnection();
    await this.db!.run('DELETE FROM NEWS WHERE id = ?', [id]);
    return this.getAllNews();
  }
}