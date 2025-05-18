import { Injectable, NestMiddleware } from '@nestjs/common';
import { ContextStore } from '../../module/context/context_store.service';
import { CustomRequestContext } from '../../module/context/custom_request_context';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(private readonly contextStore: ContextStore) {}

  public use(_: any, __: any, next: () => void) {
    const customRequestContext = CustomRequestContext.createInstance();

    return this.contextStore.create(next, customRequestContext);
  }
}
