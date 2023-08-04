import { FortyTwoAuthGuard, JwtGuard, GoogleAuthGuard } from './guard';
import { Body, Controller, HttpCode, HttpStatus, Post, Get, UseGuards, Res, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { Response } from 'express';
import { AuthDtoUp } from './dto/authup.dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    async handleSignup(@Body() dto: AuthDtoUp, @Res({ passthrough: true }) res: Response) {
        const access_token = await this.authService.signup(dto, res);
        res.cookie('access_token', access_token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 10000,
            sameSite: 'lax',
        });
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    async signin(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
        const access_token = await this.authService.signin(dto);
        res.cookie('access_token', access_token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 10000,
            sameSite: 'lax',
        });
        return { message: 'Signin successful' };
    }

    // add a filter like for image upload to return errors
    // @usefilter
    @Get('42/login')
    @UseGuards(FortyTwoAuthGuard)
    handle42Login() {
        return { msg: '42 Authentification' };
    }

    // add a filter like for image upload to return errors
    // @usefilter
    @Get('42/redirect')
    @UseGuards(FortyTwoAuthGuard)
    async handle42Redirect(@Req() req, @Res({ passthrough: true }) res: Response) { //@Res? Passthrough?
        const access_token = await this.authService.login(req.user /*, false*/);
        res.cookie('access_token', access_token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 10000,
            sameSite: 'lax',
        });
        res.redirect('/profile/me');
    }

    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    handleGoogleLogin() {
    }

    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    async handleGoogleRedirect(@Req() req, @Res({ passthrough: true }) res: Response) {
        const access_token = await this.authService.login(req.user /*, false*/);
        res.cookie('access_token', access_token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 10000,
            sameSite: 'lax',
        });
        res.redirect('/profile/me');
    }

    @Get('test123')
    @UseGuards(JwtGuard)
    async test123(@Res() res) {
        res.json('good');
    }

    

}