import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { CoreAdapterModule } from '../../coreadapter/coreadapter.module'
import { FirebaseModule } from '../../modules/firebase/core/firebase.module'
import { TagResolver } from './tag'
import { GenericResolver } from './example.resolver'
import { YourEntityResolver } from './your-entity.resolver'
import { FirebaseService } from '../../modules/firebase/core/firebase.service'
import { FirebaseResolver } from './firebase.resolver'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule,
    CoreAdapterModule,
    FirebaseModule.register({
      credentialsPath: process.env.FIREBASE_CREDENTIALS_PATH,
      firebaseOptions: {
        projectId: process.env.FIREBASE_PROJECT_ID,
      }
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      path: '/api/graphql',
      context: ({ req }) => ({ req }), //see https://github.com/nestjs/graphql/issues/48#issuecomment-420693225
      subscriptions: {
        'graphql-ws': true,
      },
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
    }),
  ],
  providers: [
    TagResolver, 
    GenericResolver, 
    YourEntityResolver, 
    FirebaseResolver
  ],
})
export class AppGraphQLModule {}
