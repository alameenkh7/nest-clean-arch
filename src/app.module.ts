import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { FirebaseService } from './services/firebase.service';
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
    })
  ],
  providers: [
    FirebaseService, 
    FirebaseResolver
  ],
  exports: [FirebaseService]
})
export class AppModule {}
