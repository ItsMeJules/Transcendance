import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EditUserDto } from './dto';
import { User, Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { URL } from 'url';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as sharp from 'sharp';
import {
  constructPictureUrl,
  constructPicturePath,
  constructPicturePathNoImage,
} from './module';
import { Response } from 'express';

const MAX_FILE_SIZE = 1000 * 1000 * 10; // 1 MB (you can adjust this value as needed)

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private config: ConfigService) { }

  async editUser(userId: number, dto: EditUserDto) {
    if (dto.username && dto.username.length > 100)
      throw new ForbiddenException('Username too long');
    else if (dto.firstName && dto.firstName.length > 100)
      throw new ForbiddenException('First name too long');
    else if (dto.lastName && dto.lastName.length > 100)
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
    const oldPictureObj = user.profilePicture;

    // Verify file size and delete file if too big
    // if (file.size > MAX_FILE_SIZE) {
    //   try {
    //     const pathToDelete =
    //       process.cwd() +
    //       this.config.get('PUBLIC_FOLDER') +
    //       this.config.get('IMAGES_FOLDER') +
    //       '/' +
    //       response.filename;
    //     console.log('Del 1:', pathToDelete);
    //     fs.unlinkSync(pathToDelete);
    //   } catch (err: any) { }
    //   throw new ForbiddenException('File too large (>10MB)');
    // }

    // Compress and store file and delete uncompressed
    try {
      const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
      const newPicPath = constructPicturePath('cmp_' + response.filename);
      const newPicUrl = constructPictureUrl('cmp_' + response.filename);
      console.log('filextenso:', fileExtension);
      console.log('newpicpath:', newPicPath);
      console.log('newpicurl:', newPicUrl);
      let compressionOptions;
      if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
        compressionOptions = {
          quality: 50, // Adjust the quality as needed (0 - 100)
        };
      } else if (fileExtension === 'png') {
        compressionOptions = {
          quality: 50, // Adjust the quality as needed (0 - 100)
          progressive: true, // Enable progressive rendering for PNG
          compressionLevel: 9, // Adjust compression level for PNG (0 - 9)
        };
      } else {
        throw new Error('File format not supported'); // better redirection
      }
      await sharp(file.path)
        .toFormat(fileExtension)
        .jpeg(compressionOptions)
        .toFile(newPicPath);
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          profilePicture: newPicUrl,
        },
      });
      fs.unlinkSync(file.path);
    } catch (err: any) {
      console.log(err);
      // better error redirection
      throw new InternalServerErrorException('Failed to compress the image.');
    }

    // Delete the previous profile picture from the file system
    try {
      const pathToDelete = "/workspace/back/public" + oldPictureObj.replace("/api", "");
      console.log("pathtodelete:", pathToDelete);
      if (
        pathToDelete &&
        oldPictureObj !==
        process.env.IMAGES_FOLDER + process.env.DEFAULT_PROFILE_PICTURE
      )
        fs.unlinkSync(pathToDelete);
    } catch (err: any) { }
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
    console.log('username:', data.username);
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
      where: { id: id },
    });
    return user;
  }

  async getLeaderboard(): Promise<User[]> {
    const leaderboard = await this.prisma.user.findMany({
      orderBy: {
        userPoints: 'desc', // Sorting by the 'score' field in descending order (highest to lowest)
      },
    });
    return leaderboard;
  }

  async addFriendToggler(userId: number, friendId: number) {
    try {
      if (userId === friendId) return;
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          friends: {
            where: { id: friendId },
            select: { id: true }
          }
        },
      });
      // console.log("user:", user);
      if (user.friends.length === 0) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { friends: { connect: { id: friendId } } },
        });
        return { friendStatus: 'Is friend' };
      } else {
        await this.prisma.user.update({
          where: { id: userId },
          data: { friends: { disconnect: { id: friendId } } },
        });
        return { friendStatus: 'Is not friend' };
      }
    } catch (error) {
      // console.error('Error adding friend:', error);
    }
  }





}
