import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from '../client/client.module';
import { EventModule } from '../event/event.module';
import { ListenerController } from './listener.controller';
import { Listener } from './listener.entity';
import { ListenerService } from './listener.service';

@Module({
  imports: [
    forwardRef(() => EventModule),
    TypeOrmModule.forFeature([Listener]),
    forwardRef(() => ClientModule),
  ],
  providers: [ListenerService],
  exports: [ListenerService],
  controllers: [ListenerController],
})
export class ListenerModule {}
