import { SetMetadata } from '@nestjs/common';

export const IgnoreAuthGuard = () => SetMetadata('ignoreAuthGuard', true);
