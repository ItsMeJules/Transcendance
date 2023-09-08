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
} from './module';
import { EventEmitter } from 'events';
import handlePrismaError from '@utils/prisma.error';

export const userServiceEmitter = new EventEmitter();

const MAX_FILE_SIZE = 1000 * 1000 * 10; // 1 MB (you can adjust this value as needed)

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) { }

  async editUser(userId: number, dto: EditUserDto) {
    if (dto.username && dto.username.length > 100)
      throw new ForbiddenException('Username too long');
    else if (dto.firstName && dto.firstName.length > 100)
      throw new ForbiddenException('First name too long');
    else if (dto.lastName && dto.lastName.length > 100)
      throw new ForbiddenException('Last name too long');
    try {
      const user = await this.prismaService.user.update({
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
    return this.prismaService.user.findMany();
  }

  async uploadProfilePic(user: User, file: any): Promise<any> {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    let errorFlag = false;
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
      } else {
        errorFlag = true;
        throw new ForbiddenException('Wrong format provide a jpeg/jpg file');
      }
      try {
        await sharp(file.path)
          .toFormat(fileExtension)
          .jpeg(compressionOptions)
          .toFile(newPicPath);
      } catch (err) { return; }
      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          profilePicture: newPicUrl,
        },
      });
      userServiceEmitter.emit('refreshHeader', { userId: user.id });
      fs.unlinkSync(file.path);
    } catch (error) { throw (error); }
    try {
      if (errorFlag) return;
      const pathToDelete =
        '/workspace/back/public' + oldPictureObj.replace('/api', '');
      if (pathToDelete !== '/workspace/back/public/images/logo.png')
        fs.unlinkSync(pathToDelete);
    } catch (err: any) { }
  }

  async isUserNameTaken(username: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { username } });
    if (user) delete user.hash;
    return user;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    if (!!(await this.isUserNameTaken(data.username))) return null;
    const user = await this.prismaService.user.create({ data });
    if (user) delete user.hash;
    return user;
  }

  async isEmailTaken(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (user) delete user.hash;
    return user;
  }

  async findOneById(id: number): Promise<User | null> {
    if (!id) return null;
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: id },
      });
      if (user) delete user.hash;
      return user;
    } catch (error) { handlePrismaError(error); }
  }

  async getLeaderboard(): Promise<User[]> {
    const leaderboard = await this.prismaService.user.findMany({
      orderBy: {
        userPoints: 'desc', // Sorting by the 'score' field in descending order (highest to lowest)
      },
    });
    leaderboard.forEach((user) => {
      if (user) delete user.hash;
    })
    return leaderboard;
  }

  async addFriendToggler(userId: number, friendId: number): Promise<any> {
    try {
      if (userId === friendId) return;
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
        select: {
          friends: {
            where: { id: friendId },
            select: { id: true },
          },
        },
      });
      if (user.friends.length === 0) {
        await this.prismaService.user.update({
          where: { id: userId },
          data: { friends: { connect: { id: friendId } } },
        });
        userServiceEmitter.emit('updateFriendsOfUser', { userId: userId })
        return { isFriend: 'true' };
      } else {
        await this.prismaService.user.update({
          where: { id: userId },
          data: { friends: { disconnect: { id: friendId } } },
        });
        userServiceEmitter.emit('updateFriendsOfUser', { userId: userId })
        return { isFriend: 'false' };
      }
    } catch (error) { handlePrismaError(error); }
  }

  // >>>>>>>>>>>>>>> GAME HISTORY <<<<<<<<<<<<<<<<<<<<<<<<<<

  async getUserGameHistory(id: number): Promise<Game[]> {
    const gameHistory = await this.prismaService.game.findMany({
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
