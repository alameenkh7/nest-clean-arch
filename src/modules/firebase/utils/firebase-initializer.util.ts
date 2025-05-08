import * as admin from 'firebase-admin';
import * as path from 'path';
import { FirebaseConfig } from '../interfaces/firebase-config.interface';
import { existsSync } from 'fs';

export function initializeFirebase(config: FirebaseConfig): admin.firestore.Firestore | null {
  if (!config.credentialsPath) {
    console.warn('Firebase credentials path not provided');
    return null;
  }

  const credentialsPath = config.credentialsPath;

  if (!existsSync(credentialsPath)) {
    console.warn(`Firebase credentials file not found at: ${credentialsPath}`);
    return null;
  }

  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(credentialsPath),
        ...config.options
      });
    } catch (error) {
      console.warn('Firebase initialization failed:', error);
      return null;
    }
  }
  
  return admin.firestore();
}
