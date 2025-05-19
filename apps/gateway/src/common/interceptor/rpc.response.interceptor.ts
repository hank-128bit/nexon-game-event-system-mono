import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RpcResponseError } from '../error/rpc.response.error';

@Injectable()
export class RpcResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        const data = response?.data?.[0] ?? response.data;
        if (data?.error && data?.error?.code !== 200) {
          throw new RpcResponseError(
            data.error.message,
            data.error.code,
            data.error.service
          );
        }
        return data;
      }),
      catchError((err) => throwError(() => err))
    );
  }
}
