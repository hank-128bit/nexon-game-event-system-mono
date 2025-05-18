import { Global, Module } from '@nestjs/common';
import { ContextStore } from './context_store.service';

@Global()
@Module({
  providers: [ContextStore],
  exports: [ContextStore],
})
export class ContextModule {}
