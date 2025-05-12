import { Injectable } from '@angular/core';
import { CommentFirebaseServiceInterface } from './interfaces/comment-firebase-service.interface';
import { addDoc, collection, CollectionReference, doc, DocumentSnapshot, Firestore, FirestoreDataConverter, getDoc, setDoc, SnapshotOptions } from 'firebase/firestore';
import { CommentModel } from '../../../models/comment.model';

interface FirestoreComment {
  userID: string,
  content: string;
  createdAt: string;
}

export const usersConverter: FirestoreDataConverter<CommentModel, FirestoreComment> = {
  toFirestore: (comment: CommentModel) => {
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
    } as CommentModel;
  },
};

@Injectable({
  providedIn: 'root'
})
export class CommentsFirebaseService implements CommentFirebaseServiceInterface {

  private readonly db: Firestore;
  private comments: CollectionReference<CommentModel>

  constructor(db: Firestore) {
    this.db = db;
    this.comments = collection(this.db, '/comments') as CollectionReference<CommentModel>;
  }

  async getCommentById(id: string): Promise<CommentModel> {
    return (await getDoc(doc(this.comments, `${id}`))).data() as CommentModel;
  }

  async addComment(comment: CommentModel): Promise<string> {
    return (await addDoc(this.comments, comment)).id;
  }

  async addCommentByID(comment: CommentModel, id: string): Promise<any> {
    const document = doc(this.comments, `${id}`);
    await setDoc(document, comment);
  }
}
