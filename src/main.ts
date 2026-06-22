import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MyFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      // supprime les champs non déclarés dans le DTO
      whitelist: true,
      // rejette la requête si champs inconnu présent
      forbidNonWhitelisted: true,
      // transforme automatiquement les types (string vers number pour les params)
      transform: true,
    }),
  );

  app.useGlobalFilters(new MyFilter(), new PrismaExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Mini CRM')
    .setDescription('Documentation API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3001;

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  await app.listen(port);

  console.log(`API URL: http://localhost:${port}/api`);
  console.log(`API DOCS: http://localhost:${port}/api/docs`);
}
bootstrap();
