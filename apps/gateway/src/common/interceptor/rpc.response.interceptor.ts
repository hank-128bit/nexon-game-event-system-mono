import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RpcResponseError } from '../error/rpc.response.error';
import { BaseResponseBodyDTO } from '@libs/interfaces/base.dto';

@Injectable()
export class RpcResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<BaseResponseBodyDTO<any>> {
    return next.handle().pipe(
      map((response) => {
        if (response?.error && response?.error?.code !== 200) {
          /**
           * 모든 마이크로서비스는 에러 발생 시 error, code 필드를 리턴
           * 마이크로서비스 응답 에러 객체를 에러 필터에 throw 하여 auth, event 서비스 에러 동일 처리 보장
           */
          throw new RpcResponseError(
            response.error.message,
            response.error.code,
            response.error.service
          );
        }
        return {
          data: response,
          status: 200,
        };
      }),
      catchError((err) => throwError(() => err))
    );
  }
}
