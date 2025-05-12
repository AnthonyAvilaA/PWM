import { Injectable } from '@angular/core';
import { addDoc, collection, CollectionReference, doc, DocumentData, DocumentReference, DocumentSnapshot, Firestore, FirestoreDataConverter, getDoc, getDocs, setDoc, SnapshotOptions } from 'firebase/firestore';
import { UserModel } from '../../../models/user.model';
import { UserFirebaseServiceInterface } from './interfaces/user-firebase-service.interface';


interface FirestoreUser {
  name: string;
  email: string;
  image_url: string;
}

export const usersConverter: FirestoreDataConverter<UserModel, FirestoreUser> = {
  toFirestore: (user: UserModel) => {
    return {
      name: user.name,
      email: user.email,
      image_url: user.image_url,
    } as FirestoreUser;
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options)! as FirestoreUser;
    return {
      name: data.name,
      email: data.email,
      image_url: data.image_url,
    } as FirestoreUser;
  },
};

@Injectable({
  providedIn: 'root'
})
export class UserFirebaseService implements UserFirebaseServiceInterface {

    private readonly db: Firestore;
    private readonly users: CollectionReference<UserModel>;

    constructor(db: Firestore) {
      this.db = db;
      this.users = collection(this.db, '/users').withConverter(usersConverter);
    }

  async getUserById(id: string): Promise<UserModel> {
    return (await getDoc(doc(this.users, `${id}`))).data() as UserModel;
  }

  async addUser(User: UserModel): Promise<string> {
    return (await addDoc(this.users, User)).id;
  }
}
