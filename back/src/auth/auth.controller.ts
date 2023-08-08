import { FortyTwoAuthGuard, JwtGuard, GoogleAuthGuard } from './guard';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { authenticator } from 'otplib';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { TwoFaService } from './two-fa/two-fa.service';
import { GetUser } from './decorator';
import { User } from '@prisma/client';
import { Response as ExResponse } from 'express'; // Import Express.js Response
import { UnauthorizedException } from '@nestjs/common';
import { TwoFaCodeDto } from './dto/two-fa-auth-code';
import { JwtService } from '@nestjs/jwt';
import { NoTwoFaException } from './exceptions/no-two-fa.exception';
import JwtTwoFactorGuard from './guard/jwt.two-fa.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private twoFaService: TwoFaService,
    private jwtService: JwtService,
  ) {}

  @Post('signup')
  async signup(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const access_token = await this.authService.signup(dto);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });
    return { message: 'Signup successful' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const access_token = await this.authService.signin(dto);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });
    return { message: 'Signin successful' };
  }

  @Get('42/login')
  @UseGuards(FortyTwoAuthGuard)
  handle42Login() {
    return { msg: '42 Authentification' };
  }

  @Get('42/redirect')
  @UseGuards(FortyTwoAuthGuard)
  async handle42Redirect(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const access_token = await this.authService.login(req.user);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });
    res.redirect('http://localhost:4000/profile/me');
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleGoogleLogin() {
    return { msg: 'Google Authentification' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async handleGoogleRedirect(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const access_token = await this.authService.login(req.user);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });
    res.redirect('http://localhost:4000/profile/me');
  }

  // // // // // // // // // // 2FA \\ \\ \\ \\ \\ \\ \\ \\ \\ \\

  @Post('turn-on')
  @UseGuards(JwtGuard)
  async register(
    @Res({ passthrough: false }) res: Response, // why passthrough false?
    @GetUser() user: User,
  ): Promise<ArrayBuffer> {
    await this.userService.turnOnTwoFactorAuthentication(user.id);

    const otpAuthUrlOne =
      await this.twoFaService.generateTwoFactorAuthenticationSecret(user);

    const accessTokenCookie = this.jwtService.sign({
      id: user.id,
      isTwoFactorAuthenticationVerified: true,
    });

    res.cookie('access_token', accessTokenCookie, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });

    return this.twoFaService.pipeQrCodeStream(res, otpAuthUrlOne.otpAuthUrl);
  }

  @Post('authenticate')
  @UseGuards(JwtTwoFactorGuard)
  async authenticate(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
    @Body() body: any,
  ) {
    const code = body.twoFactorAuthentificationCode;
    console.log(code);
    if (!user.isTwoFactorAuthenticationEnabled) {
      throw new NoTwoFaException();
    }
    const isCodeValid = this.twoFaService.isTwoFactorAuthenticationCodeValid(
      code,
      user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    const accessTokenCookie = this.jwtService.sign({
      id: user.id,
      isTwoFactorAuthenticationVerified: true,
    });

    res.cookie('access_token', accessTokenCookie, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });
  }

  @Post('turn-off')
  @UseGuards(JwtGuard)
  async turnoff(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.userService.turnOffTwoFactorAuthentication(user.id);

    const accessTokenCookie = this.jwtService.sign({
      id: user.id,
      isTwoFactorAuthenticationVerified: false,
    });

    res.cookie('access_token', accessTokenCookie, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });
  }
}
