import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppGraphQLModule } from '../gateways/graphql/graphql.module';
import { CoreAdapterModule } from '../coreadapter/coreadapter.module';
import { FirebaseModule } from '../modules/firebase/core/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    CoreAdapterModule,
    FirebaseModule.register({
      credentialsPath: process.env.FIREBASE_CREDENTIALS_PATH,
      firebaseOptions: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        // Add other Firebase configuration options as needed
      }
    }),
    AppGraphQLModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
