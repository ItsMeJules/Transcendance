import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto';
import { User, Prisma } from '@prisma/client';
import { Multer, multer } from 'multer';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { URL } from 'url';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    if (user) delete user.hash;
    return user;
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async uploadProfilePic(user: User, file: any) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };

    const newProfilePictureUrl =
      this.config.get('API_BASE_URL') +
      this.config.get('IMAGES_FOLDER') +
      '/' +
      response.filename;
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
    try {
      const urlObj = new URL(oldProfilePictureUrl);
      const pathToDelete =
        process.cwd() + this.config.get('PUBLIC_FOLDER') + urlObj.pathname;
      if (
        pathToDelete &&
        urlObj.pathname !==
          this.config.get('IMAGES_FOLDER') +
            this.config.get('DEFAULT_PROFILE_PICTURE')
      ) {
        fs.unlinkSync(pathToDelete);
      }
    } catch (err: any) {}
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    if (!!(await this.isUserNameTaken(data.username))) return null;
    return this.prisma.user.create({ data });
  }

  async isUserNameTaken(username: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async isEmailTaken(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOrCreateUserOAuth(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = await this.isEmailTaken(data.email);
    if (user) {
      return user;
    }

    const createdUser = await this.prisma.user.create({ data });

    return createdUser;
  }

  async findOneById(id: number): Promise<User | null> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  // 2fa Implementation

  async setTwoFactorAuthenticationSecret(
    secret: string,
    userId: number,
  ): Promise<User> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        twoFactorAuthenticationSecret: secret,
      },
    });
    return user;
  }

  async turnOnTwoFactorAuthentication(userId: number): Promise<User> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isTwoFactorAuthenticationEnabled: true,
      },
    });
    return user;
  }

  async turnOffTwoFactorAuthentication(userId: number): Promise<User> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isTwoFactorAuthenticationEnabled: false,
        twoFactorAuthenticationSecret: null,
      },
    });
    return user;
  }
}
