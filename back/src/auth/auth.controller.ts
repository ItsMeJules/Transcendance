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
  Headers
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Response } from 'express';
import { AuthDtoUp } from './dto/authup.dto';
import { TwoFaService } from './two-fa.service';
import { GetUser } from './decorator';
import { User } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NoTwoFaException } from './exceptions/no-two-fa.exception';
import JwtTwoFactorGuard from './guard/jwt.two-fa.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import handleJwtError from '@utils/jwt.error';
import * as cookieParser from 'cookie-parser';

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string };
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prismaService: PrismaService,
    private twoFaService: TwoFaService,
    private jwtService: JwtService,
  ) { }

  /* Token verif on page home - error management ok */
  @Get('home')
  async homeTokenVerification(
    @Req() req: RequestWithCookies,
  ): Promise<{ tokenState: string }> {
    const token = req.cookies['access_token'];
    if (!token) return { tokenState: 'NO_TOKEN' };
    const isTokenValid = this.authService.validateJwtToken(token, true);
    if (!isTokenValid) return { tokenState: 'NO_TOKEN' };
    return { tokenState: 'HAS_TOKEN' };
  }

  /* Signup - error management ok */
  @Post('signup')
  async signup(
    @Body() dto: AuthDtoUp,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const access_token = await this.authService.signup(dto);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 150,
      sameSite: 'lax',
    });
    const user = await this.authService.validateJwtToken(access_token, true);
    if (user) await this.authService.connectUserToAllPublicRooms(user.id);
    return user;
  }

  /* Signin - error management ok */
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const access_token = await this.authService.signin(dto);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 150,
      sameSite: 'lax',
    });
    const user = await this.authService.validateJwtToken(access_token, true);
    if (user) delete user.hash;
    await this.authService.connectUserToAllPublicRooms(user.id);
    return user;
  }

  /* OAuth */
  /* 42 login - error management ok */
  @Get('42/login')
  @UseGuards(FortyTwoAuthGuard)
  handle42Login(): { msg: string } {
    return { msg: '42 Authentification' };
  }

  /* 42 redirection - error management ok */
  @Get('42/redirect')
  @UseGuards(FortyTwoAuthGuard)
  async handle42Redirect(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const access_token = await this.authService.login(req.user);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 15000,
      sameSite: 'lax',
    });
    const user = await this.authService.validateJwtToken(access_token, false);
    if (!user) {
      const errorMessage = 'nouser';
      return res.redirect(`/login?error=${errorMessage}`);
    }
    if (user.hash !== '') {
      const errorMessage = 'passwordrequired';
      return res.redirect(`/login?error=${errorMessage}`);
    }
    if (user) await this.authService.connectUserToAllPublicRooms(user.id);
    return res.redirect('/dashboard/profile/me');
  }

  /* google login - error management ok */
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleGoogleLogin(): { msg: string } {
    return { msg: '42 Authentification' };
  }

  /* google redirection - error management ok */
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async handleGoogleRedirect(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const access_token = await this.authService.login(req.user);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 150,
      sameSite: 'lax',
    });
    const user = await this.authService.validateJwtToken(access_token, false);
    if (!user) {
      const errorMessage = 'nouser';
      return res.redirect(`/login?error=${errorMessage}`);
    }
    if (user.hash !== '') {
      const errorMessage = 'passwordrequired';
      return res.redirect(`/login?error=${errorMessage}`);
    }
    if (user) await this.authService.connectUserToAllPublicRooms(user.id);
    return res.redirect('/dashboard/profile/me');
  }

  /* 2FA */
  /* Turn on 2FA - error management ok */
  @Post('turn-on')
  @UseGuards(JwtGuard)
  async register(
    @Res({ passthrough: false }) res: Response,
    @GetUser() user: User,
  ): Promise<ArrayBuffer> {
    try {
      await this.prismaService.turnOnTwoFactorAuthentication(user.id);
      const otpAuthUrlOne =
        await this.twoFaService.generateTwoFactorAuthenticationSecret(user);
      const accessTokenCookie = this.jwtService.sign({
        id: user.id,
        isTwoFactorAuthenticationVerified: true,
      });
      res.cookie('access_token', accessTokenCookie, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 150,
        sameSite: 'lax',
      });
      return this.twoFaService.pipeQrCodeStream(res, otpAuthUrlOne.otpAuthUrl);
    } catch (error) {
      handleJwtError(error);
    }
  }

  /* Authentification 2FA - error management ok */
  @Post('authenticate')
  @UseGuards(JwtTwoFactorGuard)
  async authenticate(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
    @Body() body: any,
  ): Promise<void> {

    const code = body.twoFactorAuthentificationCode;
    if (!user.isTwoFactorAuthenticationEnabled)
      throw new NoTwoFaException();
    if (code === '') return;
    const isCodeValid = this.twoFaService.isTwoFactorAuthenticationCodeValid(
      code,
      user,
    );
    if (!isCodeValid)
      throw new UnauthorizedException('Wrong authentication code');

    try {
      const accessTokenCookie = this.jwtService.sign({
        id: user.id,
        isTwoFactorAuthenticationVerified: true,
      });

      res.cookie('access_token', accessTokenCookie, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 150,
        sameSite: 'lax',
      });
    } catch (error) {
      handleJwtError(error);
    }
  }

  /* Turn off 2FA - error management ok */
  @Post('turn-off')
  @UseGuards(JwtGuard)
  async turnoff(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.prismaService.turnOffTwoFactorAuthentication(user.id);

    try {
      const accessTokenCookie = this.jwtService.sign({
        id: user.id,
        isTwoFactorAuthenticationVerified: false,
      });

      res.cookie('access_token', accessTokenCookie, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 150,
        sameSite: 'lax',
      });
    } catch (error) {
      handleJwtError(error);
    }
  }
}
