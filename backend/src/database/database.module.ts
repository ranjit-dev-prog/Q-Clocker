import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DRIZZLE_PROVIDER } from './connection';

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: DRIZZLE_PROVIDER,
      useFactory: (dbService: DatabaseService) => dbService.db,
      inject: [DatabaseService],
    },
  ],
  exports: [DatabaseService, DRIZZLE_PROVIDER],
})
export class DatabaseModule {}
