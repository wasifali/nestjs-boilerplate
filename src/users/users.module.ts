import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SchemasModule } from '../schemas/schemas.module';
import { HelpersModule } from '../helpers/helpers.module';

@Module({
  imports: [SchemasModule, forwardRef(() => HelpersModule)],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
