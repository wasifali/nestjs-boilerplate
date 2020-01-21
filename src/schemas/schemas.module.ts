import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';

const schemasArray = [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])];

@Module({
  imports: schemasArray,
  exports: schemasArray,
})
export class SchemasModule {}
