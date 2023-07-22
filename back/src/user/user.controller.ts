import { Body, Controller, Get, Patch, Req, UseGuards, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express'
// import { Multer } from 'multer';
import { Multer, multer } from 'multer';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('me')
    getMe(@GetUser() user: User) {

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

    @Post("uploadpic")
    @UseInterceptors(FileInterceptor("profilePic"))
    async uploadProfilePic(@GetUser() user: User, @UploadedFile() file: Multer) {
        // Handle the file upload and update the user's profile picture in the database
        // You can use the 'file' object to access the uploaded image data and the 'user' object to identify the user who is uploading the picture
        // Save the image file path or URL in the database to associate it with the user's profile
        // Make sure to handle any error that may occur during the upload process
    }
}
