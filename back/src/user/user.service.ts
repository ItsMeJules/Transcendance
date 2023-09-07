import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EditUserDto } from './dto';
import { Game, User, Prisma } from '@prisma/client';
import * as fs from 'fs';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as sharp from 'sharp';
import {
  constructPictureUrl,
  constructPicturePath,
  constructPicturePathNoImage,
} from './module';
import { Response } from 'express';
import { hash } from 'argon2';
import { EventEmitter } from 'events';

export const userServiceEmitter = new EventEmitter();

const MAX_FILE_SIZE = 1000 * 1000 * 10; // 1 MB (you can adjust this value as needed)

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
    try {
      const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
      const newPicPath = constructPicturePath('cmp_' + response.filename);
      const newPicUrl = constructPictureUrl('cmp_' + response.filename);
      let compressionOptions;
      if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
        compressionOptions = {
          quality: 50,
        };
      } else if (fileExtension === 'png') {
        compressionOptions = {
          quality: 50,
          progressive: true,
          compressionLevel: 9,
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
      const pathToDelete =
        '/workspace/back/public' + oldPictureObj.replace('/api', '');
      if (pathToDelete !== '/workspace/back/public/images/logo.png') {
        fs.unlinkSync(pathToDelete);
      }
    } catch (err: any) { }
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    if (!!(await this.isUserNameTaken(data.username))) return null;
    const user = await this.prisma.user.create({ data });
    if (user) delete user.hash;
    return user;
  }

  async isUserNameTaken(username: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (user) delete user.hash;
    return user;
  }

  async isEmailTaken(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) delete user.hash;
    return user;
  }

  async findOrCreateUserOAuth(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = await this.isEmailTaken(data.email);
    if (user) return user;
    let usernameAvailable = false;
    let modifiedUsername = data.username;
    // Check if username is taken
    while (!usernameAvailable) {
      const userNameCheck = await this.isUserNameTaken(modifiedUsername);
      if (!userNameCheck) {
        usernameAvailable = true;
      } else {
        const randomSuffix = Math.floor(Math.random() * 9); // You can adjust the range of the random number as needed
        modifiedUsername = data.username + randomSuffix;
      }
    }
    data.username = modifiedUsername;
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
    if (!id) return null;
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (user) delete user.hash;
    return user;
  }

  async getLeaderboard(): Promise<User[]> {
    const leaderboard = await this.prisma.user.findMany({
      orderBy: {
        userPoints: 'desc', // Sorting by the 'score' field in descending order (highest to lowest)
      },
    });
    leaderboard.forEach((user) => {
      if (user) delete user.hash;
    })
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
            select: { id: true },
          },
        },
      });
      if (user.friends.length === 0) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { friends: { connect: { id: friendId } } },
        });
        userServiceEmitter.emit('updateFriendsOfUser', { userId: userId })
        return { isFriend: 'true' };
      } else {
        await this.prisma.user.update({
          where: { id: userId },
          data: { friends: { disconnect: { id: friendId } } },
        });
        userServiceEmitter.emit('updateFriendsOfUser', { userId: userId })
        return { isFriend: 'false' };
      }
    } catch (error) {
      // console.error('Error adding friend:', error);
    }
  }

    // >>>>>>>>>>>>>>> GAME HISTORY <<<<<<<<<<<<<<<<<<<<<<<<<<

    async getUserGameHistory(id: number): Promise<Game[]> {
      const gameHistory = await this.prisma.game.findMany({
        where: {
          OR: [
            { player1Id: id },
            { player2Id: id },
          ],
        },
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          player1: true, // Include the related player1 user data
          player2: true, // Include the related player2 user data
        },
      });
    
      return gameHistory;
    }
    
  
    // >>>>>>>><<<<<<>>>>>>>>>><<<<<<>>>>>>>>>>><<<<<<<<<<<<
}
