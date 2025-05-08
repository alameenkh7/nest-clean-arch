import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private firestore: admin.firestore.Firestore;

  constructor(private configService: ConfigService) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: this.configService.get('FIREBASE_PROJECT_ID'),
          clientEmail: this.configService.get('FIREBASE_CLIENT_EMAIL'),
          privateKey: this.configService.get('FIREBASE_PRIVATE_KEY')?.replace(/\n/g, '\n')
        })
      });
    }
    this.firestore = admin.firestore();
  }

  // Method to get collection reference for advanced querying
  getCollectionRef(collection: string): admin.firestore.CollectionReference {
    return this.firestore.collection(collection);
  }

  async create(collection: string, data: any): Promise<string> {
    const docRef = await this.firestore.collection(collection).add(data);
    return docRef.id;
  }

  async findById(collection: string, id: string): Promise<any> {
    const doc = await this.firestore.collection(collection).doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  async findAll(collection: string, options?: { 
    limit?: number, 
    offset?: number 
  }): Promise<any[]> {
    let collectionRef = this.firestore.collection(collection);
    let query = collectionRef.limit(options?.limit || 10);
    
    if (options?.offset) {
      // Note: Firestore doesn't have a direct offset method
      // We'll use startAfter with a cursor for pagination
      const startAfterDoc = await collectionRef
        .orderBy('createdAt') // Assumes a createdAt field exists
        .limit(options.offset)
        .get();
      
      const lastDoc = startAfterDoc.docs[startAfterDoc.docs.length - 1];
      if (lastDoc) {
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async update(collection: string, id: string, data: any): Promise<void> {
    await this.firestore.collection(collection).doc(id).update(data);
  }

  async delete(collection: string, id: string): Promise<void> {
    await this.firestore.collection(collection).doc(id).delete();
  }
}
