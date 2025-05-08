import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { YourEntity } from '../graphql/types';

@Injectable()
export class FirebaseService {
  private firestore: admin.firestore.Firestore;
  private logger = new Logger(FirebaseService.name);

  constructor() {
    try {
      if (!admin.apps.length) {
        const credentialsPath = path.resolve(__dirname, '../../../firebase-credentials.json');
        this.logger.log(`Initializing Firebase with credentials from: ${credentialsPath}`);
        
        admin.initializeApp({
          credential: admin.credential.cert(credentialsPath)
        });
      }
      this.firestore = admin.firestore();
    } catch (error) {
      this.logger.error('Firebase initialization error', error);
      throw error;
    }
  }

  async create(data: YourEntity): Promise<string> {
    try {
      const docRef = await this.firestore.collection('items').add({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      this.logger.error('Error creating item', error);
      throw error;
    }
  }

  async findAll(options: { 
    take?: number; 
    skip?: number; 
  } = {}): Promise<[YourEntity[], number]> {
    try {
      const { take = 10, skip = 0 } = options;

      const collectionRef = this.firestore.collection('items');
      
      // Get total count
      const totalSnapshot = await collectionRef.count().get();
      const total = totalSnapshot.data().count;

      // Fetch paginated items
      const querySnapshot = await collectionRef
        .limit(take)
        .offset(skip)
        .get();

      const items: YourEntity[] = querySnapshot.docs.map(doc => {
        const data = doc.data() as YourEntity;
        return {
          ...data,
          id: doc.id
        };
      });

      return [items, total];
    } catch (error) {
      this.logger.error('Error finding items', error);
      throw error;
    }
  }

  async findById(id: string): Promise<YourEntity | null> {
    try {
      const docRef = this.firestore.collection('items').doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data() as YourEntity;
      return {
        ...data,
        id: doc.id
      };
    } catch (error) {
      this.logger.error('Error finding item by ID', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<YourEntity>): Promise<YourEntity | null> {
    try {
      const docRef = this.firestore.collection('items').doc(id);
      
      // Check if document exists
      const doc = await docRef.get();
      if (!doc.exists) {
        return null;
      }

      // Update document
      await docRef.update({
        ...data,
        updatedAt: new Date().toISOString()
      });

      // Fetch and return updated document
      const updatedDoc = await docRef.get();
      const updatedData = updatedDoc.data() as YourEntity;
      return {
        ...updatedData,
        id: updatedDoc.id
      };
    } catch (error) {
      this.logger.error('Error updating item', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const docRef = this.firestore.collection('items').doc(id);
      await docRef.delete();
      return true;
    } catch (error) {
      this.logger.error('Error deleting item', error);
      throw error;
    }
  }
}
