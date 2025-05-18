import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { BaseError } from '@libs/interfaces/base.error';
import { GatewayLogger } from '../logger/logger';
import _ from 'lodash';

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
        statusCode: exception.getStatus(),
        message: errorMessage,
      });
    }

    if (exception instanceof BaseError) {
      return response.status(exception.code).json({
        statusCode: exception.code,
        message: exception.message,
      });
    }

    this.logger.error(
      `예상치 못한 예외가 발생했습니다. ${errorName}: ${errorMessage}\n`,
      exception?.stack ? exception.stack : exception
    );

    return response.status(500).json({
      statusCode: 500,
      message: '예상치 못한 예외가 발생했습니다.',
    });
  }
}
