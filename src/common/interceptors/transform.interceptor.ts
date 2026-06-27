import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const statusCode = ctx.switchToHttp().getResponse().statusCode;
    return next.handle().pipe(
      map((data) => {
        return { statusCode, data };
      }),
    );
  }
}
