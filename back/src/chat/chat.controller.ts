import { Controller, Get } from '@nestjs/common';
import { Room, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomInfo } from './partial_types/partial.types';

@Controller('chat')
export class ChatController {
  constructor(private prisma: PrismaService) {}

  @Get('/active-rooms')
  async getActiveRooms(@GetUser() user: User): Promise<RoomInfo[]> {
    return await this.prisma.returnUserVisibleRooms(user.id);
  }
}
