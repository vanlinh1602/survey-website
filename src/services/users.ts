import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import { User } from '@/features/user/type';

import { firestore } from './firebase';

export class UsersService {
  static async getUser(email: string): Promise<User | null> {
    const docRef = doc(firestore, 'users', email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as User;
    }
    return null;
  }

  static async queryUsers(filter?: CustomObject<string>): Promise<User[]> {
    const collectionDB = collection(firestore, 'users');
    let snapshot;
    if (filter) {
      const queries = Object.entries(filter).map(([key, value]) =>
        where(key, '==', value)
      );
      const q = query(collectionDB, ...queries);
      snapshot = await getDocs(q);
    } else {
      snapshot = await getDocs(collectionDB);
    }
    return snapshot.docs.map((d) => d.data() as User);
  }

  static async updateUser(email: string, user: Partial<User>): Promise<void> {
    const docRef = doc(firestore, 'users', email);
    await updateDoc(docRef, user);
  }

  static async createUser(email: string, user: Partial<User>): Promise<string> {
    const docRef = doc(firestore, 'users', email);
    await setDoc(docRef, user);
    return docRef.id;
  }

  static async deleteUser(email: string): Promise<void> {
    const docRef = doc(firestore, 'users', email);
    await deleteDoc(docRef);
  }
}
