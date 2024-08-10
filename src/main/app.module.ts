import { Module } from '@nestjs/common'
import {
  // Configuration,
  NormalizedConfModule,
} from '../config/NormalizedConfModule'
import { AppGraphQLModule } from 'src/gateways/graphql/graphql.module'
import { HttpModule } from 'src/gateways/http/http.module'
import { LoggerModule } from '../infrastructure/Logger/logger.module'
import { AppService } from './app.service'

@Module({
  imports: [NormalizedConfModule, LoggerModule, HttpModule, AppGraphQLModule],
  providers: [AppService],
})
export class AppModule {}
