import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express'; // Import the Request type

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Request & { user: any } = ctx.switchToHttp().getRequest();

    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
