import { Injectable } from '@nestjs/common';
import { AuthDto } from './auth/dto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async test(dto: AuthDto) {
    console.log(dto);
  }

}
