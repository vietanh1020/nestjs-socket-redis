import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtDecoded } from 'src/types';

export const JwtUser = createParamDecorator(
  (key: keyof JwtDecoded, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtDecoded;
    return key ? user?.[key] : user;
  },
);
