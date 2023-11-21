import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateEvent, FindEvent, IEvent, IEventService } from './event';
import { Event } from './event.entity';

@Injectable()
export class EventService implements IEventService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
  ) {}
  Find(request: FindEvent): Observable<IEvent> {
    throw new Error('Method not implemented.');
  }

  async Create(request: CreateEvent): Promise<Event> {
    let event = await this.eventRepository.findOne({
      where: { name: request.name },
    });
    if (!event) event = this.eventRepository.create(request);
    else event = { ...event, ...request };
    console.log(await this.eventRepository.save(event));
    event = await this.eventRepository.save(event);
    return event;
  }

  async find(request: FindEvent): Promise<Event[]> {
    return await this.eventRepository.find(request);
  }
}
