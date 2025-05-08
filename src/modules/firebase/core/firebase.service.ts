import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { 
  FirebaseConfig, 
  FirebaseServiceOptions,
  isValidFirebaseConfig
} from '../interfaces/firebase-config.interface';
import { 
  DEFAULT_COLLECTION_NAME, 
  FIREBASE_CREDENTIALS_PATH,
  FIREBASE_CONFIG_DEFAULTS
} from '../constants/firebase.constants';
import { initializeFirebase } from '../utils/firebase-initializer.util';

@Injectable()
export class FirebaseService<T extends { id?: string }> {
  private readonly firestore: admin.firestore.Firestore | null;
  private readonly logger = new Logger(FirebaseService.name);
  private readonly collectionName: string;

  constructor(
    private readonly options: FirebaseServiceOptions = {}
  ) {
    const config: FirebaseConfig = {
      credentialsPath: options.credentialsPath || FIREBASE_CREDENTIALS_PATH,
      ...options.firebaseOptions
    };

    this.firestore = initializeFirebase(config);
    this.collectionName = options.collectionName || DEFAULT_COLLECTION_NAME;

    if (!this.firestore) {
      this.logger.warn('Firebase not initialized. CRUD operations will be unavailable.');
      throw new Error('Firebase not initialized');
    }
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    if (!this.firestore) {
      throw new Error('Firebase not initialized');
    }
    try {
      const docRef = await this.firestore.collection(this.collectionName).add(data);
      return { ...data, id: docRef.id } as T;
    } catch (error: any) {
      this.logger.error(`Error creating document in ${this.collectionName}`, error);
      throw error;
    }
  }

  async findById(id: string): Promise<T | null> {
    if (!this.firestore) {
      throw new Error('Firebase not initialized');
    }
    try {
      const doc = await this.firestore.collection(this.collectionName).doc(id).get();
      return doc.exists ? { id: doc.id, ...doc.data() } as T : null;
    } catch (error: any) {
      this.logger.error(`Error finding document by ID in ${this.collectionName}`, error);
      throw error;
    }
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    if (!this.firestore) {
      throw new Error('Firebase not initialized');
    }
    try {
      const docRef = this.firestore.collection(this.collectionName).doc(id);
      await docRef.update({
        ...data,
        updatedAt: new Date().toISOString()
      });

      const updatedDoc = await docRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() } as T;
    } catch (error: any) {
      this.logger.error(`Error updating document in ${this.collectionName}`, error);
      throw error;
    }
  }

  async delete(documentId: string): Promise<void> {
    if (!this.firestore) {
      throw new Error('Firebase not initialized');
    }
    try {
      await this.firestore.collection(this.collectionName).doc(documentId).delete();
    } catch (error: any) {
      this.logger.error(`Error deleting document in ${this.collectionName}`, error);
      throw error;
    }
  }

  async findAll(limit = 10): Promise<T[]> {
    if (!this.firestore) {
      throw new Error('Firebase not initialized');
    }
    try {
      const snapshot = await this.firestore.collection(this.collectionName).limit(limit).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    } catch (error: any) {
      this.logger.error(`Error retrieving documents from ${this.collectionName}`, error);
      throw error;
    }
  }

  async findWithPagination({
    page = 1,
    limit = 10
  }): Promise<{
    items: T[];
    total: number;
  }> {
    if (!this.firestore) {
      throw new Error('Firebase not initialized');
    }
    try {
      const offset = (page - 1) * limit;

      const countQuery = await this.firestore.collection(this.collectionName).count().get();
      const totalCount = countQuery.data().count;

      const querySnapshot = await this.firestore
        .collection(this.collectionName)
        .offset(offset)
        .limit(limit)
        .get();

      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));

      return { items, total: totalCount };
    } catch (error: any) {
      this.logger.error(`Error retrieving paginated documents from ${this.collectionName}`, error);
      throw error;
    }
  }
}
