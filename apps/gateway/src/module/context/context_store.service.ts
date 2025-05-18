import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { CustomRequestContext } from './custom_request_context';
import { RoleContext } from './context.type';

@Injectable()
export class ContextStore<
  Data extends Record<string, any> = Record<string, any>
> {
  private readonly store = new AsyncLocalStorage<CustomRequestContext<Data>>();

  public create(
    callback: () => any,
    data: CustomRequestContext<Data> = new CustomRequestContext<Data>()
  ) {
    return this.store.run(data, callback);
  }

  public getContext() {
    const ctx = this.store.getStore();

    if (!ctx) {
      throw new Error('No context found');
    }

    return ctx;
  }

  public getData<T extends keyof RoleContext>(key: T) {
    const ctx = this.getContext();
    return ctx.get<T>(key);
  }
}
