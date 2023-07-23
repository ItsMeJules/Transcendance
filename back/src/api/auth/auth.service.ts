import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../database/service/user.service';
import { PayloadDto } from './dto/payload.dto';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async login(user: any/*, is2FAAuthenticated: boolean*/): Promise<any> {
      const payload : PayloadDto = {
        id: user.id,
        // is2FAEnabled: user.twoFactorAuthStatus,
        // is2FAAuthenticated,
      };
      return this.jwtService.sign(payload);
  }

  public async getUserfromAuthenticationToken(token: string) {
    if (!token) return;
    const payload: any = this.jwtService.verify(token, {
      secret: process.env.jwtSecret
    });
    if (payload.id){
      const userReturned = await this.userService.findOneById(payload.id);
      console.log('userReturned: ', userReturned);
      return userReturned;
    }
  }

}
