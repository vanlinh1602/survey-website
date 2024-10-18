import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { Response } from '@/features/responses/type';

import { firestore } from './firebase';

export class ResponsesService {
  static async queryResponses(surveyId: string): Promise<Response[]> {
    const collectionDB = collection(firestore, 'responses');
    const q = query(collectionDB, where('surveyId', '==', surveyId));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((d) => d.data() as Response);
    return data;
  }

  static async createResponse(responses: ResponsesService): Promise<string> {
    const docRef = collection(firestore, 'responses');
    await addDoc(docRef, {
      ...responses,
      createdAt: Date.now(),
    });
    return docRef.id;
  }

  static async deleteResponses(surveyId: string): Promise<void> {
    const q = query(
      collection(firestore, 'responses'),
      where('surveyId', '==', surveyId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  }
}
