import { forwardRef, Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { HelpersModule } from '../helpers/helpers.module';

@Module({
  imports: [forwardRef(() => HelpersModule)],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class SocketsModule {}
