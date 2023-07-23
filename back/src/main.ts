import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

//   app.useGlobalPipes(new ValidationPipe({
//     whitelist: true,
//     forbidNonWhitelisted: true,
//     transform: true
//   }));

	app.enableCors({
		origin: 'http://localhost:4000',
		credentials: true,
	});
	
	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
	}));

	app.use(cookieParser());
	
  await app.listen(3000);
}

bootstrap();