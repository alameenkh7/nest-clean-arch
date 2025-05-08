import { Module, DynamicModule } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { Logger } from '@nestjs/common';
import { FirebaseServiceOptions } from '../interfaces/firebase-config.interface';

@Module({})
export class FirebaseModule {
  static register(options: FirebaseServiceOptions = {}): DynamicModule {
    return {
      module: FirebaseModule,
      providers: [
        {
          provide: FirebaseService,
          useFactory: () => {
            try {
              return new FirebaseService(options);
            } catch (error) {
              const logger = new Logger(FirebaseModule.name);
              logger.warn('Firebase initialization skipped:', error.message);
              return null;
            }
          }
        }
      ],
      exports: [FirebaseService]
    };
  }
}
