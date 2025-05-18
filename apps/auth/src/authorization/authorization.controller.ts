import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

interface SigninRequest {
  email: string;
}
interface SigninResponse {
  token: string;
}
@Controller()
export class AuthorizationController {
  @MessagePattern('signin')
  async signin(param: SigninRequest): Promise<SigninResponse> {
    console.log(param);
    return { token: 'aaaa' };
  }

  @EventPattern('signup')
  async handleSignupEvent(data: Record<string, unknown>) {
    return {};
  }
}
