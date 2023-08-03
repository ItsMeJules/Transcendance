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

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private twoFaService: TwoFaService,
  ) {}

  @Post('signup')
  async handleSignup(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const access_token = await this.authService.signup(dto);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 10000,
      sameSite: 'lax',
    });
    return { message: 'Signup successful' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
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
    //@Res? Passthrough?
    const access_token = await this.authService.login(req.user /*, false*/);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 10000,
      sameSite: 'lax',
    });
    res.redirect('http://localhost:4000/profile/me');
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleGoogleLogin() {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async handleGoogleRedirect(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const access_token = await this.authService.login(req.user /*, false*/);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 10000,
      sameSite: 'lax',
    });
    res.redirect('http://localhost:4000/profile/me');
  }

  @Get('test123')
  @UseGuards(JwtGuard)
  async test123(@Res() res) {
    res.json('good');
  }

  @Post('generatesecret')
  @UseGuards(JwtGuard)
  async register(
    @Res() response: ExResponse, // Use Express.js Response type
    @GetUser() user: User,
  ): Promise<ArrayBuffer> {
    const otpAuthUrlOne =
      await this.twoFaService.generateTwoFactorAuthenticationSecret(user);

    return this.twoFaService.pipeQrCodeStream(
      response,
      otpAuthUrlOne.otpAuthUrl,
    );
  }

  @Post('verify')
  verifyOtpSecret() {}

  @Post('validate')
  validateOtpToken() {}

  @Post('disable')
  disableOtpFeature() {}
}
