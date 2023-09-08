import { BadRequestException, ForbiddenException, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Message,
  Prisma,
  PrismaClient,
  Room,
  RoomType,
  User,
} from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import handlePrismaError from '@utils/prisma.error';
import { RoomInfo } from 'src/chat/partial_types/partial.types';
import { CompleteRoom, CompleteUser } from 'src/utils/complete.type';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  /* Initilization */
  async onModuleInit(): Promise<Room> {
    await this.$connect();
    try {
      let generalChat = await this.room.findUnique({
        where: { id: 1 },
      });
      if (!generalChat) {
        generalChat = await this.room.create({
          data: {
            name: 'general',
            //rajouter tous les users sur la creation de chaque chat generals!
          },
        });
      }
      return generalChat;
    } catch (error) { handlePrismaError(error); }
  }

  /* Shutdown */
  async onApplicationShutdown(signal?: string): Promise<void> {
    await this.$disconnect();
  }

  /* Main function to get user by id and return without hash - error management ok */
  async findUserById(id: number): Promise<User | null> {
    if (!id) return null;
    try {
      const user = await this.user.findUnique({
        where: { id: id },
      });
      if (user) delete user.hash;
      return user;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /* Find user by email and delete hash - error management ok */
  async findUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.user.findUnique({ where: { email } });
      return user;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /* Find user by email and delete hash - error management ok */
  async getUserById(userId: number): Promise<User | null> {
    try {
      return await this.user.findUnique({
        where: { id: userId },
        include: { friends: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findUserByUsername(username: string): Promise<User> {
    try {
      return this.user.findUnique({ where: { username } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

    /* Return all room infos - error management ok */
    async returnCompleteRoom(roomName: string): Promise<CompleteRoom> {
      try {
        const room = await this.room.findUnique({
          where: { name: roomName },
          include: {
            users: true,
            bans: true,
            admins: true,
            mutes: true,
            messages: true,
            usersOnRoom: true,
          },
        });
        if (!room)
          throw new BadRequestException('no room');
        return room;
      } catch (error) {
        handlePrismaError(error);
        throw (error);
      }
    }
  
    /* Return all information about a user without the hash - error management ok */
    async returnCompleteUser(userId: number): Promise<CompleteUser> {
      try {
        const user = await this.user.findUnique({
          where: { id: userId },
          include: {
            friends: true,
            friendsOf: true,
            player1Games: true,
            player2Games: true,
            wonGames: true,
            lostGames: true,
            mutedRooms: true,
            adminRooms: true,
            activeRooms: true,
            ownedRooms: true,
            bannedRooms: true,
            messages: true,
            blockedUsers: true,
            blockedByUser: true,
          },
        });
        if (!user)
          throw new BadRequestException('No user');
        return user;
      } catch (error) {
        handlePrismaError(error);
        throw (error);
      }
    }

  /* OAuth find or create user if not existing - error management ok */
  async findOrCreateUserOAuth(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = await this.findUserByEmail(data.email);
    if (user) return user;
    // User doesn't exist, now check if the username is not already taken to protect 2FA sign up
    let usernameAvailable = false;
    let modifiedUsername = data.username;
    while (!usernameAvailable) {
      const userNameCheck = await this.findUserByUsername(modifiedUsername);
      if (!userNameCheck) {
        usernameAvailable = true;
      } else {
        const randomSuffix = Math.floor(Math.random() * 9);
        modifiedUsername = data.username + randomSuffix;
      }
    }
    data.username = modifiedUsername;
    try {
      const createdUser = await this.user.create({ data });
      return createdUser;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /* 2FA */
  /* Set 2FA secret - error management ok */
  async setTwoFactorAuthenticationSecret(
    secret: string,
    userId: number,
  ): Promise<User> {
    try {
      const user = await this.user.update({
        where: {
          id: userId,
        },
        data: {
          twoFactorAuthenticationSecret: secret,
        },
      });
      return user;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /* Turn on 2FA - error management ok */
  async turnOnTwoFactorAuthentication(userId: number): Promise<User> {
    try {
      const user = await this.user.update({
        where: {
          id: userId,
        },
        data: {
          isTwoFactorAuthenticationEnabled: true,
        },
      });
      if (user) delete user.hash;
      return user;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /* Turn on 2FA - error management ok */
  async turnOffTwoFactorAuthentication(userId: number): Promise<User> {
    try {
      const user = await this.user.update({
        where: {
          id: userId,
        },
        data: {
          isTwoFactorAuthenticationEnabled: false,
          twoFactorAuthenticationSecret: null,
        },
      });
      return user;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /* Chat */
  /* Return visible rooms to user - error management ok */
  async returnUserVisibleRooms(userId: number): Promise<RoomInfo[]> {
    try {
      const user = await this.returnCompleteUser(userId);
      const activeRoomsId = user.activeRooms.map((room) => room.id);

      const rooms = await this.room.findMany({
        where: {
          OR: [
            {
              AND: [
                {
                  id: {
                    in: activeRoomsId,
                  },
                },
                {
                  type: {
                    not: RoomType.DIRECT,
                  },
                },
              ],
            },
            {
              AND: [
                {
                  NOT: {
                    id: {
                      in: activeRoomsId,
                    },
                  },
                },
                {
                  type: {
                    not: RoomType.PRIVATE,
                  },
                },
              ],
            },
          ],
        },
        select: {
          name: true,
          type: true,
          password: true,
          ownerId: true,
          admins: true,
          bans: true,
          users: true,
        },
        orderBy: { createdAt: 'asc' },
      });
      
      const roomsInfo = rooms.map((room) => {
        const hasPassword =
          room.password !== null && room.password.length !== 0;

        return {
          name: room.name,
          type:
            room.type === RoomType.PUBLIC && hasPassword
              ? RoomType.PROTECTED
              : room.type,
          hasPassword: hasPassword,
          userCount: room.users.length,
          ownerId: room.ownerId,
          adminsId: room.admins.map((admin) => admin.id),
          bannedId: room.bans.map((bans) => bans.id),
        };
      });

      return roomsInfo;
    } catch (error) {
      handlePrismaError(error);
      throw (error);
    }
  }

  /* Return all information about a user without the hash - error management ok */
  async allBannedUsersFromRoom(roomName: string): Promise<User[]> {
    try {
      const room = await this.returnCompleteRoom(roomName);
      if (!room) {
        throw new Error('no room named' + roomName);
      }
      if (room.bans) {
        return room.bans;
      } else {
        throw new Error('no bans');
      }
    } catch (error) {
      handlePrismaError(error);
      throw (error);
    }
  }

  async allMutedUsersFromRoom(roomName: string): Promise<User[]> {
    try {
      const room = await this.returnCompleteRoom(roomName);
      if (!room) {
        throw new Error('no room named' + roomName);
      }
      if (room.mutes) {
        return room.mutes;
      } else {
        throw new Error('no muted users');
      }
    } catch (error) {
      handlePrismaError(error);
      throw (error);
    }
  }

  async allAdminsFromRoom(roomName: string): Promise<User[]> {
    try {
      const room = await this.returnCompleteRoom(roomName);
      if (!room) {
        throw new Error('no room named' + roomName);
      }
      return room.admins;
    } catch (error) {
      handlePrismaError(error);
      throw (error);
    }
  }

  async allMessagesFromRoom(roomName: string): Promise<Message[]> {
    try {
      const room = await this.returnCompleteRoom(roomName);
      if (!room) {
        throw new Error('no room named' + roomName);
      }
      return room.messages;
    } catch (error) {
      handlePrismaError(error);
      throw (error);
    }
  }

  async allBlockedUsersFromUser(userId: number): Promise<User[]> {
    try {
      const user = await this.returnCompleteUser(userId);
      if (!user.blockedUsers) {
        throw new Error('no users blocked by ' + user.username);
      }
      return user.blockedUsers;
    } catch (error) {
      handlePrismaError(error);
      throw (error);
    }
  }

  async allRoomsFromUser(userId: number): Promise<Room[]> {
    try {
      const user = await this.returnCompleteUser(userId);
      if (!user.activeRooms) {
        throw new Error('no rooms for this user');
      }
      return user.activeRooms;
    } catch (error) {
      handlePrismaError(error);
      throw (error);
    }
  }

  async allUsersFromRoom(roomName: string): Promise<User[]> {
    try {
      const room = await this.returnCompleteRoom(roomName);
      if (!room) {
        throw new Error('no room named' + roomName);
      }
      if (!room.usersOnRoom)
        throw new Error('no users on this room' + roomName);
      return room.usersOnRoom;
    } catch (error) {
      handlePrismaError(error);
      throw (error);
    }
  }
}
