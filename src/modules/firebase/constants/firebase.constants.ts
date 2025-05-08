export const DEFAULT_COLLECTION_NAME = 'items';

// Credentials Path
export const FIREBASE_CREDENTIALS_PATH = process.env.FIREBASE_CREDENTIALS_PATH || 'd:/rearway technologies/4/nest-clean-arch/firebase-credentials.json';

// Firebase Environment Configuration
export const FIREBASE_ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  STAGING: 'staging'
};

// Firebase Configuration Defaults
export const FIREBASE_CONFIG_DEFAULTS = {
  MAX_RETRIES: 3,
  TIMEOUT_MS: 10000,
  CACHE_SIZE_BYTES: 40 * 1024 * 1024, // 40MB
};
