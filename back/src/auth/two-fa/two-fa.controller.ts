import {
  Controller,
  Post,
  UseGuards,
  Res,
  Body,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { TwoFaService } from './two-fa.service';
import { JwtGuard } from '../guard';
import { GetUser } from '../decorator';
import { User } from '@prisma/client';
import { TwoFaCodeDto } from '../dto/two-fa-auth-code';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';

@Controller('2fa')
export class TwoFaController {
  constructor(
    private readonly twoFaService: TwoFaService,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  //   @Post('turn-on')
  //   @HttpCode(200) // ?
  //   @UseGuards(JwtGuard)
  //   async turnOnTwoFactorAuthentication(
  //     @GetUser() user: User,
  //     @Body() { twoFactorAuthenticationCode }: TwoFaCodeDto,
  //   ) {
  //     await this.userService.turnOnTwoFactorAuthentication(user.id);
  //   }

  //   @Post('authenticate')
  //   @HttpCode(200)
  //   @UseGuards(JwtGuard)
  //   async authenticate(
  //     @GetUser() user: User,
  //     @Res({ passthrough: true }) res: Response,
  //     @Body() { twoFactorAuthenticationCode }: TwoFaCodeDto,
  //   ) {
  //     const isCodeValid = this.twoFaService.isTwoFactorAuthenticationCodeValid(
  //       twoFactorAuthenticationCode,
  //       user,
  //     );
  //     if (!isCodeValid) {
  //       throw new UnauthorizedException('Wrong authentication code');
  //     }

  //     const accessTokenCookie = this.jwtService.sign({
  //       id: user.id,
  //       isTwoFactorAuthenticationVerified: true,
  //     });

  //     res.cookie('access_token', accessTokenCookie, {
  //       httpOnly: true,
  //       maxAge: 60 * 60 * 24 * 7,
  //       sameSite: 'lax',
  //     });

  //     return user;
  //   }
}
