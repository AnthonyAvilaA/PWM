export interface LiveNewsModel {
  ID: string;
  title: string;
  authorID: string;
  description: string;
  content: LiveNewsContentItem[];
  image: string;
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LiveNewsContentItem {
  title: string;
  description: string;
  timestamp: Date;
}
