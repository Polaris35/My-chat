import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // app.enableCors({ origin: ['http://localhost:3001'] });

    app.setGlobalPrefix('apis');

    const config = new DocumentBuilder()
        .setTitle('Chat example')
        .setDescription('The chat API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    app.use(cookieParser());
    await app.listen(3000);
}

bootstrap();
