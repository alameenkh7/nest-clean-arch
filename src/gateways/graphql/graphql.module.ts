import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { CoreAdapterModule } from '../../coreadapter/coreadapter.module'
import { InMemoryStorageModule } from '../../infrastructure/InMemoryStorage/inmemorystorage.module'
import { TagResolver } from './tag'

@Module({
  imports: [
    CoreAdapterModule,
    InMemoryStorageModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      path: '/api/graphql',
      context: ({ req }) => ({ req }), //see https://github.com/nestjs/graphql/issues/48#issuecomment-420693225
      subscriptions: {
        'graphql-ws': true,
      },
    }),
  ],
  providers: [TagResolver],
})
export class AppGraphQLModule {}
