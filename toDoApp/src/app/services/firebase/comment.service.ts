import { Injectable } from '@angular/core';
import { collection, CollectionReference, doc, Firestore } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { db } from 'src/environments/environment';
import { docData } from 'rxfire/firestore';
import { Comment } from 'src/app/models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  firebase: Firestore = db;
  collection: CollectionReference<Comment>;

  constructor() {
    this.collection = collection(this.firebase, 'comments') as CollectionReference<Comment>;
  }

  getCommentById(id: string): Observable<Comment> {
    const commentRef = collection(this.firebase, 'comments') as CollectionReference<Comment>;
    const commentDoc = doc(commentRef, id);
    return docData(commentDoc, { idField: 'ID' }) as Observable<Comment>;
  }
}
