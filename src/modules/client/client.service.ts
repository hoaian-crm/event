import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Channel, Connection, connect } from 'amqplib/callback_api';
import { EmitEventDto } from 'src/prototypes/gen/ts/interfaces/event';
import { Event } from '../event/event.entity';
import { EventService } from '../event/event.service';
import { Listener } from '../listener/listener.entity';
import { ListenerService } from '../listener/listener.service';

@Injectable()
export class ClientService {
  connection: Connection;
  channel: Channel;
  events: Array<Event>;
  listeners: Array<Listener>;
  constructor(
    @Inject(forwardRef(() => EventService))
    private eventService: EventService,
    @Inject(forwardRef(() => ListenerService))
    private listenerService: ListenerService,
  ) {}

  async connect(): Promise<Connection> {
    return new Promise((resolve) => {
      connect(process.env.AMQP_LINK, (err, connection) => {
        if (err) throw err;
        resolve(connection);
      });
    });
  }

  async createChannel(): Promise<Channel> {
    return new Promise((resolve) => {
      this.connection.createChannel((err, channel) => {
        if (err) throw err;
        resolve(channel);
      });

      this.connection.on('error', function (error) {
        console.error(error);
      });
    });
  }

  async syncEvent() {
    this.events = await this.eventService.Find();
    this.events.map((event) =>
      this.channel.assertExchange(event.name, 'fanout', { durable: false }),
    );
  }

  async syncListener() {
    this.listeners = await this.listenerService.Find();
    this.listeners.map((listener) => {
      this.channel.assertQueue(listener.name, { durable: false });
      this.channel.bindQueue(listener.name, listener.event.name, '');
    });
  }

  async onModuleInit() {
    this.connection = await this.connect(); // NOTE: call this first
    this.channel = await this.createChannel();
    await this.syncEvent();
    await this.syncListener();
  }

  async emit(request: EmitEventDto) {
    if (!this.events.find((e) => e.name === request.name)) {
      throw new RpcException(new BadRequestException('Not found event'));
    }

    return this.channel.publish(
      request.name,
      '',
      Buffer.from(JSON.stringify(request[Object.keys(request)[1]])),
    );
  }
}
