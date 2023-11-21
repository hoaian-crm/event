import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateEvent, FindEvent } from './event';
import { EventService } from './event.service';

@Controller()
export class EventController {
  constructor(private eventService: EventService) {}

  @GrpcMethod('IEventService', 'Create')
  async create(data: CreateEvent) {
    return await this.eventService.Create(data);
  }

  @Get()
  async find(data: FindEvent) {
    return await this.eventService.find(data);
  }
}
