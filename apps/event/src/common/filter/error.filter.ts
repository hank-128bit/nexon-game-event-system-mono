import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { EventServiceLogger } from '../logger/logger';
import { EventServiceError } from '../error/event_service.error';

@Injectable()
@Catch()
export class ErrorFilter implements ExceptionFilter {
  private readonly logger = new EventServiceLogger(ErrorFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToRpc();

    const formatErrorResponse = (
      message: string,
      code = 500,
      service = 'event'
    ) => ({
      error: {
        message,
        code,
        service,
      },
    });

    if (exception instanceof EventServiceError) {
      this.logger.warn(`[Handled EventServiceError] ${exception.message}`);

      return formatErrorResponse(
        exception.message,
        exception.code,
        exception.service || 'event'
      );
    }

    if (exception instanceof RpcException) {
      const message = exception.getError();

      if (typeof message === 'string') {
        return formatErrorResponse(message);
      }

      if (
        typeof message === 'object' &&
        message !== null &&
        'message' in message
      ) {
        const { message: errorMessage, code } = message as {
          message: string;
          code?: number;
        };
        return formatErrorResponse(errorMessage, code || 500);
      }

      return formatErrorResponse('예상치 못한 RPC 예외가 발생했습니다.');
    }

    if (exception instanceof Error) {
      const errorName = exception.name || 'UnnamedError';
      const errorMessage = exception.message || 'Empty';

      this.logger.error(
        `[UnexpectedError] ${errorName}: ${errorMessage}`,
        exception.stack || exception
      );

      return formatErrorResponse('서버 내부 오류가 발생했습니다.');
    }

    this.logger.error('[UnknownExceptionType]', exception);
    return formatErrorResponse('정의되지 않은 예외가 발생했습니다.');
  }
}
