import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import {
  CreateEventDto,
  EmitEventDto,
  GetEventDto,
  IEvent,
} from 'src/prototypes/gen/ts/interfaces/event';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
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
    console.log(await this.eventRepository.save(event));
    event = await this.eventRepository.save(event);
    return event;
  }

  async Emit(request: EmitEventDto) {

  }
}
