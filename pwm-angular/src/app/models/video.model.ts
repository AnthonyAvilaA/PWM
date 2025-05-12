export interface VideoData {
  id?: number | string;
  documentId?: string;
  Title: string;
  author: {
    id?: number | string;
    documentId?: string;
    username: string;
    email?: string;
    provider?: string;
    confirmed?: boolean;
    blocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    publishedAt?: Date | null;
  };
  description: string;
  video_url: string;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date | null;
}
