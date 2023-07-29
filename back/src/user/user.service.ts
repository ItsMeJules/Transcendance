import { Injectable, ForbiddenException, ConsoleLogger } from '@nestjs/common';
import { EditUserDto } from './dto';
import { User, Prisma } from '@prisma/client';
import { Multer, multer } from 'multer';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { URL } from 'url';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { use } from 'passport';

const MAX_FILE_SIZE = 1024 * 1024 * 10; // 1 MB (you can adjust this value as needed)

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async editUser(userId: number, dto: EditUserDto) {
    console.log(dto.username.length);

    if (dto.username.length > 100)
      throw new ForbiddenException('Username too long');
    else if (dto.firstName.length > 100)
      throw new ForbiddenException('First name too long');
    else if (dto.lastName.length > 100)
      throw new ForbiddenException('Last name too long');
    try {
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
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Add more errors handlers or a default one?
          throw new ForbiddenException('Username taken');
        }
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async uploadProfilePic(user: User, file: any) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };

    if (file.size > MAX_FILE_SIZE)
      throw new ForbiddenException('File too large (>10MB)');

    const newProfilePictureUrl =
      this.config.get('API_BASE_URL') +
      this.config.get('IMAGES_FOLDER') +
      '/' +
      response.filename;
    const oldProfilePictureUrl = user.profilePicture;

    console.log('new pic:', newProfilePictureUrl);

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
    let usernameAvailable = false;
    let modifiedUsername = data.username;
    // Check if username is taken
    while (!usernameAvailable) {
      const userNameCheck = await this.isUserNameTaken(modifiedUsername);
      console.log('test:', userNameCheck);
      if (!userNameCheck) {
        usernameAvailable = true;
      } else {
        const randomSuffix = Math.floor(Math.random() * 9); // You can adjust the range of the random number as needed
        modifiedUsername = data.username + randomSuffix;
      }
    }
    data.username = modifiedUsername;
    console.log("username:", data.username);
    // Create user with new username
    try {
      const createdUser = await this.prisma.user.create({ data });
      return createdUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Add more errors handlers or a default one?
          throw new ForbiddenException('Username taken');
        }
      }
      throw error;
    }
  }

  async findOneById(id: number): Promise<User | null> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }
}
