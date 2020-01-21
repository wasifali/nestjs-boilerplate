import { HttpModule, Module } from '@nestjs/common';
import { StringHelper } from './string.helper';
import { ConfigModule } from '../config/config.module';
import { SchemasModule } from '../schemas/schemas.module';
import { AuthHelper } from './auth.helper';

@Module({
  imports: [HttpModule, ConfigModule, SchemasModule],
  providers: [StringHelper, AuthHelper],
  exports: [StringHelper, AuthHelper],
})
export class HelpersModule {}
