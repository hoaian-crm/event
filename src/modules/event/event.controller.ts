import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateEventDto,
  EmitEventDto,
  EmitEventResult,
  GetEventDto,
  IEvent,
  IEventController,
} from 'src/prototypes/gen/ts/interfaces/event';
import { EventService } from './event.service';

@Controller('events')
export class EventController implements IEventController {
  constructor(private eventService: EventService) {}

  @GrpcMethod('IEventController', 'Get')
  async Get(request: GetEventDto): Promise<IEvent> {
    return this.eventService.Get(request);
  }

  @GrpcMethod('IEventController', 'Create')
  async Create(data: CreateEventDto) {
    return await this.eventService.Create(data);
  }

  @GrpcMethod('IEventController', 'Emit')
  async Emit(request: EmitEventDto): Promise<EmitEventResult> {
    try {
      await this.eventService.Emit(request);
      return {
        code: 200,
        message: 'Success',
      };
    } catch (error) {
      return {
        code: 400,
        message: error.message,
      };
    }
  }
}
