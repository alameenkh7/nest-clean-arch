import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppGraphQLModule } from '../gateways/graphql/graphql.module';
import { CoreAdapterModule } from '../coreadapter/coreadapter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    CoreAdapterModule,
    AppGraphQLModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
