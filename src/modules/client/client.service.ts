import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Channel, Connection, connect } from 'amqplib/callback_api';
import { EmitEventDto } from 'src/prototypes/gen/ts/interfaces/event';
import { Event } from '../event/event.entity';
import { EventService } from '../event/event.service';

@Injectable()
export class ClientService {
  connection: Connection;
  channel: Channel;
  events: Array<Event>;
  constructor(
    @Inject(forwardRef(() => EventService))
    private eventService: EventService,
  ) {}

  async connect(): Promise<Connection> {
    return new Promise((resolve, reject) => {
      connect(process.env.AMQP_LINK, (err, connection) => {
        if (err) throw err;
        resolve(connection);
      });
    });
  }

  async createChannel(): Promise<Channel> {
    return new Promise((resolve, reject) => {
      this.connection.createChannel((err, channel) => {
        if (err) throw err;
        resolve(channel);
      });

      this.connection.on('error', function (error) {
        console.log(error);
        this.createChannel().then((channel) => (this.channel = channel));
      });
    });
  }

  async assertExchanges() {
    this.events.map((event) =>
      this.channel.assertExchange(event.name, 'fanout', { durable: true }),
    );
  }

  async syncEvent() {
    this.events = await this.eventService.Find();
  }

  async onModuleInit() {
    this.connection = await this.connect(); // NOTE: call this first
    this.channel = await this.createChannel();
    await this.syncEvent();
    this.assertExchanges();
  }

  async emit(request: EmitEventDto) {
    console.log('request is: ', request);
    return this.channel.publish(
      request.name,
      '',
      Buffer.from(JSON.stringify(request.userRegister)),
    );
  }
}
