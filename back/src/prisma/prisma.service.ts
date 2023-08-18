import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { User, Room } from '@prisma/client';

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

  async addMessageRoom(roomId: number, userId: number): Promise<void> {}

  // cleanDb() {
  //     return this.$transaction([
  //         // this.bookmark.deleteMany(),
  //         this.user.deleteMany(),
  //     ]);
  // }
}
