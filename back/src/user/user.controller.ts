import { Body, Controller, Get, Patch, Req, UseGuards, Post, UseInterceptors, UploadedFile, ConsoleLogger, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express'
import { Multer, multer, diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from './module';
import { Response } from 'express';


@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('me')
    getMe(@GetUser() user: User) {
        // console.log('USERRRRRRRRRR:', user);
        return user;
    }

    @Get('all')
    async findAll() {
        return this.userService.findAll();
    }

    @Patch()
    editUser(
        @GetUser('id') userId: number,
        @Body() dto: EditUserDto,
    ) {
        return this.userService.editUser(userId, dto);
    }

    @Post("pf")
    @UseInterceptors(
        FileInterceptor("profilePicture", {
            storage: diskStorage({
                destination: 'public/images/',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        })
    )

    async uploadProfilePic(@GetUser() user: User, @UploadedFile() file) {

        return this.userService.uploadProfilePic(user, file);

    }

    // @Get('get-profile-picture')
    // sendProfilePicToFront(@GetUser() user: User, @Req() req: Request) {
    //     const baseUrl = `${req.protocol}://${req.get('host')}`;

    //     const profilePictureUrl = '/images/selfie.jpg';
    //     const absoluteUrl = `${baseUrl}${profilePictureUrl}`;

    //     console.log(absoluteUrl);
    //     return absoluteUrl;
    // }


    @Get('logout')
    async logout(@Res() res: Response) {
        console.log("LOLOLO");
        res.cookie('access_token', '', {
            httpOnly: true,
            maxAge: 0,
            sameSite: 'lax',
        });
        // res.redirect('http://localhost:4000');
    }
}
