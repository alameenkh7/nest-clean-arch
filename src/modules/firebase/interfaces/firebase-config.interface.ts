import * as admin from 'firebase-admin';

/**
 * Configuration interface for Firebase initialization
 */
export interface FirebaseConfig {
  /**
   * Path to Firebase service account credentials
   */
  credentialsPath: string;

  /**
   * Optional Firebase app initialization options
   */
  options?: Partial<admin.AppOptions>;
}

/**
 * Options for configuring Firebase service
 */
export interface FirebaseServiceOptions {
  /**
   * Optional custom collection name
   */
  collectionName?: string;
  /**
   * Optional path to Firebase service account credentials
   */
  credentialsPath?: string;
  /**
   * Optional Firebase app configuration
   */
  firebaseOptions?: admin.AppOptions;
  config?: Partial<{
    credential: admin.credential.Credential;
    databaseURL?: string;
    projectId?: string;
    storageBucket?: string;
    serviceAccountId?: string;
  }>;
}

/**
 * Type guard to validate Firebase configuration
 * @param config Firebase configuration object
 * @returns Boolean indicating if configuration is valid
 */
export function isValidFirebaseConfig(config: FirebaseConfig): boolean {
  return !!(config && config.credentialsPath);
}
