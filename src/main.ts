import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'event',
      protoPath: 'src/prototypes/interfaces/event.proto',
    },
  });

  app.startAllMicroservices();

  app.setGlobalPrefix('/api/v1');

  app.listen(process.env.APP_PORT || 3000, () => {
    console.log('App is listening on port ', process.env.APP_PORT || 3000);
  });
}
bootstrap();
