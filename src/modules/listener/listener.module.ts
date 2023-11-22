import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListenerController } from './listener.controller';
import { Listener } from './listener.entity';
import { ListenerService } from './listener.service';

@Module({
  imports: [TypeOrmModule.forFeature([Listener])],
  providers: [ListenerService],
  exports: [ListenerService],
  controllers: [ListenerController]
})
export class ListenerModule {}
