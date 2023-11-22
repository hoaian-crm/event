import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { EventService } from './event.service';
import {
  CreateEventDto,
  EmitEventDto,
  EmitEventResult,
  GetEventDto,
  IEvent,
  IEventController,
} from 'src/prototypes/gen/ts/interfaces/event';

@Controller('events')
export class EventController implements IEventController {
  constructor(private eventService: EventService) {}

  async Emit(request: EmitEventDto): Promise<EmitEventResult> {
    await this.eventService.Emit(request);
    return {
      code: 200,
      message: 'Success',
    };
  }

  @GrpcMethod('IEventController', 'Get')
  async Get(request: GetEventDto): Promise<IEvent> {
    return this.eventService.Get(request);
  }

  @GrpcMethod('IEventController', 'Create')
  async Create(data: CreateEventDto) {
    return await this.eventService.Create(data);
  }
}
