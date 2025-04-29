import { Injectable } from '@angular/core';
import { addDoc, collection, CollectionReference, doc, DocumentData, DocumentReference, DocumentSnapshot, Firestore, FirestoreDataConverter, getDoc, getDocs, setDoc, SnapshotOptions } from 'firebase/firestore';
import { User } from '@models/user';
import { UserProvider } from '../interfaces/user.provider';


interface FirestoreUser {
  name: string;
  email: string;
  image_url: string;
}

export const usersConverter: FirestoreDataConverter<User, FirestoreUser> = {
  toFirestore: (user: User) => {
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
export class UsersFirebaseProviderServiceService implements UserProvider {

    private readonly db: Firestore;
    private readonly users: CollectionReference<User>;
  
    constructor(db: Firestore) {
      this.db = db;
      this.users = collection(this.db, '/users').withConverter(usersConverter);
    }

  async getUserById(id: string): Promise<User> {
    return (await getDoc(doc(this.users, `${id}`))).data() as User;
  }

  async addUser(User: User): Promise<string> {
    return (await addDoc(this.users, User)).id;
  }
}
