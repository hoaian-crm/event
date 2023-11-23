import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { AddListenerDto } from 'src/prototypes/gen/ts/interfaces/listener';
import { Repository } from 'typeorm';
import { ClientService } from '../client/client.service';
import { EventService } from '../event/event.service';
import { Listener } from './listener.entity';

@Injectable()
export class ListenerService {
  constructor(
    @InjectRepository(Listener)
    private listenerRepository: Repository<Listener>,
    @Inject(forwardRef(() => ClientService))
    private clientService: ClientService,
    @Inject(forwardRef(() => EventService))
    private eventService: EventService,
  ) {}

  async Add(request: AddListenerDto) {
    const event = await this.eventService.Get({
      name: request.eventName,
    });
    if (!event) {
      throw new RpcException(new BadRequestException('Not found event'));
    }

    let listener = await this.listenerRepository.findOne({
      where: { name: request.name },
      relations: ['event'],
    });
    if (!listener)
      listener = this.listenerRepository.create({ ...request, event });
    else {
      listener = this.listenerRepository.create({ ...listener, ...request });
    }
    await this.clientService.syncListener();
    return await this.listenerRepository.save(listener);
  }

  async Find() {
    return this.listenerRepository.find({
      relations: ['event'],
    });
  }
}
