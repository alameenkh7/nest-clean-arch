import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { FirebaseModule } from './modules/firebase/core/firebase.module';
import { FirebaseResolver } from './gateways/graphql/firebase.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example']
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      playground: true
    }),
    FirebaseModule.register({
      credentialsPath: process.env.FIREBASE_CREDENTIALS_PATH,
      firebaseOptions: {
        projectId: process.env.FIREBASE_PROJECT_ID,
      }
    })
  ],
  providers: [
    FirebaseResolver
  ]
})
export class AppModule {}
