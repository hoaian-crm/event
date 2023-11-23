import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AddListenerDto,
  GetListenersByEventDto,
  GetListenersByEventResult,
  IListener,
  IListenerController,
} from 'src/prototypes/gen/ts/interfaces/listener';
import { ListenerService } from './listener.service';

@Controller('/listener')
export class ListenerController implements IListenerController {
  constructor(private listenerService: ListenerService) {}

  @GrpcMethod('IListenerController', 'Add')
  async Add(request: AddListenerDto): Promise<IListener> {
    const result = await this.listenerService.Add(request);
    return result;
  }
  Get(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: GetListenersByEventDto,
  ): Promise<GetListenersByEventResult> {
    throw new Error('Method not implemented.');
  }
}
