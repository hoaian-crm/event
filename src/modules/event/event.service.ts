import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateEventDto,
  EmitEventDto,
  GetEventDto,
  IEvent,
} from 'src/prototypes/gen/ts/interfaces/event';
import { Repository } from 'typeorm';
import { ClientService } from '../client/client.service';
import { Event } from './event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @Inject(forwardRef(() => ClientService))
    private clientService: ClientService,
  ) {}

  async Get(request: GetEventDto): Promise<IEvent> {
    console.log('request is: ', request);
    const event = await this.eventRepository.findOne({ where: request });
    if (!event) {
      throw new RpcException(new NotFoundException('Event not found'));
    }
    return event;
  }

  async Create(request: CreateEventDto): Promise<Event> {
    let event = await this.eventRepository.findOne({
      where: { name: request.name },
    });
    if (!event) event = this.eventRepository.create(request);
    else event = { ...event, ...request };
    event = await this.eventRepository.save(event);
    await this.clientService.syncEvent();
    return event;
  }

  async Find(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async Emit(request: EmitEventDto) {
    return await this.clientService.emit(request);
  }
}
