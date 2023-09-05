import { ForbiddenException, Injectable, OnModuleInit } from '@nestjs/common';
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

  async onModuleInit(): Promise<Room> {
    await this.$connect();
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
  }

  async onApplicationShutdown(signal?: string): Promise<void> {
    await this.$disconnect();
  }

  async getUserById(userId: number): Promise<User | null> {
    return await this.user.findUnique({
      where: { id: userId },
      include: { friends: true },
    });
  }

  async isUsernameTaken(username: string): Promise<User> {
    return this.user.findUnique({ where: { username } });
  }

  async findUserById(id: number): Promise<User | null> {
    if (!id) return null;
    const user = await this.user.findUnique({
      where: { id: id },
    });
    if (user) delete user.hash;
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.user.findUnique({ where: { email } });
  }

  async findOrCreateUserOAuth(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = await this.findUserByEmail(data.email);
    if (user) {
      return user;
    }
    let usernameAvailable = false;
    let modifiedUsername = data.username;
    // Check if username is taken
    while (!usernameAvailable) {
      const userNameCheck = await this.isUsernameTaken(modifiedUsername);
      // console.log('test:', userNameCheck);
      if (!userNameCheck) {
        usernameAvailable = true;
      } else {
        const randomSuffix = Math.floor(Math.random() * 9); // You can adjust the range of the random number as needed
        modifiedUsername = data.username + randomSuffix;
      }
    }
    data.username = modifiedUsername;
    // console.log('username:', data.username);
    try {
      const createdUser = await this.user.create({ data });
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

  async turnOnTwoFactorAuthentication(userId: number): Promise<User> {
    const user = await this.user.update({
      where: {
        id: userId,
      },
      data: {
        isTwoFactorAuthenticationEnabled: true,
      },
    });
    return user;
  }

  async setTwoFactorAuthenticationSecret(
    secret: string,
    userId: number,
  ): Promise<User> {
    const user = await this.user.update({
      where: {
        id: userId,
      },
      data: {
        twoFactorAuthenticationSecret: secret,
      },
    });
    return user;
  }

  async turnOffTwoFactorAuthentication(userId: number): Promise<User> {
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
  }

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

      const roomsInfo = rooms.map((room) => ({
        name: room.name,
        type:
          room.type === RoomType.PUBLIC &&
          room.password !== null &&
          room.password.length !== 0
            ? RoomType.PROTECTED
            : room.type,
        userCount: room.users.length,
        ownerId: room.ownerId,
        adminsId: room.admins.map((admin) => admin.id),
        bannedId: room.bans.map((bans) => bans.id),
      }));

      return roomsInfo;
    } catch (error) {
      console.log(error);
    }
  }

  async returnCompleteRoom(roomName: string): Promise<CompleteRoom> {
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
    if (!room) {
      throw new Error('no room');
    }
    return room;
  }

  async returnCompleteUser(userId: number): Promise<CompleteUser> {
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
    if (!user) {
      throw new Error('no user');
    }
    return user;
  }

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
      console.log(error);
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
      console.log(error);
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
      console.log(error);
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
      console.log(error);
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
      console.log(error);
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
      console.log(error);
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
      console.log(error);
    }
  }
}
