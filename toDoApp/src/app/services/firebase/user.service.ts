import { Injectable } from '@angular/core';
import { collection, CollectionReference, doc, Firestore } from 'firebase/firestore';
import { docData } from 'rxfire/firestore';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { db } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  firebase: Firestore = db;
  collection: CollectionReference<User>;

  constructor() {
    this.collection = collection(this.firebase, 'users') as CollectionReference<User>;
  }

  getUserbyId(id: string): Observable<User> {
    const userRef = collection(this.firebase, 'users') as CollectionReference<User>;
    const userDoc = doc(userRef, id);
    return docData(userDoc, { idField: 'ID' }) as Observable<User>;
  }
}
