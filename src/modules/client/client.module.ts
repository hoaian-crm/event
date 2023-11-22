import { Module, forwardRef } from '@nestjs/common';
import { EventModule } from '../event/event.module';
import { ClientService } from './client.service';

@Module({
  imports: [forwardRef(() => EventModule)],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
