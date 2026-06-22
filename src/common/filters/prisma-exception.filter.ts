import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let statusCode = 500;
    let message = 'Erreur interne';

    switch (exception.code) {
      case 'P2002':
        statusCode = 409;
        message = 'Cette valeur existe déja';
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Enregistrement introuvable';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Référence invalide';
        break;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
