import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { BaseError } from '@libs/interfaces/base.error';
import { GatewayLogger } from '../logger/logger';
import _ from 'lodash';
import { RpcResponseError } from '../error/rpc.response.error';
@Injectable()
@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  logger: GatewayLogger = new GatewayLogger(ErrorFilter.name);
  constructor() {
    /** TODO: Inject Webhook, Kafka Service */
  }
  public async catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const errorName: string = exception?.name || 'Unnamed';
    const errorMessage: string = exception?.message || 'Empty';

    /** 클라이언트 요청에 의한 에러가 아닌 경우 */
    if (_.isEmpty(response)) {
      this.logger.error(
        `[InternalServerErrorWithoutHost] ${errorName}: ${errorMessage}\n`,
        exception?.stack ? exception.stack : exception
      );
      return;
    }

    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json({
        status: exception.getStatus(),
        message: errorMessage,
      });
    }

    if (exception instanceof BaseError) {
      return response.status(exception.code).json({
        status: exception.code,
        message: exception.message,
      });
    }

    if (exception instanceof RpcResponseError) {
      this.logger.error(
        `${exception.service} 서버에서 에러가 발생했습니다.\nMicroserviceError: ${errorMessage}`
        // exception?.stack ? exception.stack : exception
      );

      return response.status(exception.code).json({
        status: exception.code,
        message: errorMessage,
      });
    }

    this.logger.error(
      `예상치 못한 예외가 발생했습니다. ${errorName}: ${errorMessage}`,
      exception?.stack ? exception.stack : exception
    );

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: '예상치 못한 예외가 발생했습니다.',
    });
  }
}
