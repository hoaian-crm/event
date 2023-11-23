import { Module, forwardRef } from '@nestjs/common';
import { EventModule } from '../event/event.module';
import { ListenerModule } from '../listener/listener.module';
import { ClientService } from './client.service';

@Module({
  imports: [forwardRef(() => EventModule), forwardRef(() => ListenerModule)],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
