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

import { Survey } from '@/features/surveys/type';

import { firestore } from './firebase';

export class SurveysService {
  static async getSurvey(id: string): Promise<Survey> {
    const docRef = doc(firestore, 'surveys', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Survey;
    }
    throw new Error('Survey not found');
  }

  static async updateSurvey(
    id: string,
    survey: Partial<Survey>
  ): Promise<void> {
    const docRef = doc(firestore, 'surveys', id);
    await updateDoc(docRef, survey);
  }

  static async createSurvey(survey: Survey): Promise<string> {
    const docRef = doc(firestore, 'surveys', survey.id);
    await setDoc(docRef, survey);
    return docRef.id;
  }

  static async querySurveys(filter?: CustomObject<string>): Promise<Survey[]> {
    const collectionDB = collection(firestore, 'surveys');
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
    return snapshot.docs.map((d) => d.data() as Survey);
  }

  static async deleteSurvey(id: string): Promise<void> {
    const docRef = doc(firestore, 'surveys', id);
    await deleteDoc(docRef);
  }
}
