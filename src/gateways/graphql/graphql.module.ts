import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { CoreAdapterModule } from '../../coreadapter/coreadapter.module'
import { FirebaseModule } from '../../services/firebase.module'
import { TagResolver } from './tag'
import { GenericResolver } from './example.resolver'
import { YourEntityResolver } from './your-entity.resolver'
import { FirebaseService } from '../firebase/firebase.service'
import { FirebaseResolver } from './firebase.resolver'

@Module({
  imports: [
    CoreAdapterModule,
    FirebaseModule,
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
  providers: [TagResolver, GenericResolver, YourEntityResolver, FirebaseService, FirebaseResolver],
})
export class AppGraphQLModule {}
