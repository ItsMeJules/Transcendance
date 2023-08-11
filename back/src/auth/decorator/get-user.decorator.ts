import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    console.log('request :');
    const request: Express.Request = ctx.switchToHttp().getRequest();
    console.log('request :');
    if (data) {
      return request.user[data];
    }
    console.log('request :', request.user);
    return request.user;
  },
);
