import { Injectable } from '@angular/core';
import { CommentProvider } from '../interfaces/comment.provider';
import { addDoc, collection, CollectionReference, doc, DocumentSnapshot, Firestore, FirestoreDataConverter, getDoc, setDoc, SnapshotOptions } from 'firebase/firestore';
import { Comment } from '@models/comment';

interface FirestoreComment {
  userID: string,
  content: string;
  createdAt: string;
}

export const usersConverter: FirestoreDataConverter<Comment, FirestoreComment> = {
  toFirestore: (comment: Comment) => {
    return {
      userID: comment.userID,
      content: comment.content,
      createdAt: comment.createdAt,
    } as FirestoreComment;
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options)! as FirestoreComment;
    return {
      userID: data.userID,
      content: data.content,
      createdAt: data.createdAt,
    } as Comment;
  },
};

@Injectable({
  providedIn: 'root'
})
export class CommentsFirebaseProviderServiceService implements CommentProvider {

  private readonly db: Firestore;
  private comments: CollectionReference<Comment>
  
  constructor(db: Firestore) {
    this.db = db;
    this.comments = collection(this.db, '/comments') as CollectionReference<Comment>;
  }

  async getCommentById(id: string): Promise<Comment> {
    return (await getDoc(doc(this.comments, id))).data() as Comment;
  }

  async addComment(comment: Comment): Promise<string> {
    return (await addDoc(this.comments, comment)).id;
  }

  async addCommentByID(comment: Comment, id: string): Promise<any> {
    const document = doc(this.comments, `${id}`);
    await setDoc(document, comment);
  }
}
