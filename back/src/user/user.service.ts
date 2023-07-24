import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { User } from '@prisma/client';
import { Multer, multer } from 'multer';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { URL } from 'url';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private config: ConfigService) { }

    async editUser(
        userId: number,
        dto: EditUserDto
    ) {
        console.log(dto);
        const user = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                ...dto,
            },
        });
        delete user.hash;
        return user;
    }

    async findAll() {
        return this.prisma.user.findMany();
    }

    async uploadProfilePic(
        user: User,
        file: any) {

        const response = {
            originalname: file.originalname,
            filename: file.filename,
        };

        const newProfilePictureUrl = this.config.get('API_BASE_URL') + this.config.get('IMAGES_FOLDER') + "/" + response.filename;
        const oldProfilePictureUrl = user.profilePicture;

        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                profilePicture: newProfilePictureUrl,
            },
        });

        // Delete the previous profile picture from the file system
        const urlObj = new URL(oldProfilePictureUrl);
        const pathToDelete = process.cwd() + this.config.get('PUBLIC_FOLDER') +  urlObj.pathname;
        if (pathToDelete && urlObj.pathname !== this.config.get('IMAGES_FOLDER') + this.config.get('DEFAULT_PROFILE_PICTURE')) {
            try {
                fs.unlinkSync(pathToDelete);
            } catch (err:any) { }
        }
    }
}
