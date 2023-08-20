import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, User, Room, Message } from '@prisma/client';
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

  async onModuleInit() {
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
    console.log('generalChat:', generalChat);
    return generalChat;
  }

  async onApplicationShutdown(signal?: string) {
    await this.$disconnect();
  }

  async getUserById(userId: number): Promise<User | null> {
    return this.user.findUnique({
      where: { id: userId },
      include: { friends: true },
    });
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
        throw new Error('no users blocked by ' + user.username);
      }
      return user.activeRooms;
    } catch (error) {
      console.log(error);
    }
  }
}
