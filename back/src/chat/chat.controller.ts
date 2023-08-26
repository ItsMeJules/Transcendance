import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomInfo } from './partial_types/partial.types';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {
  constructor(private prisma: PrismaService) {}

  @Get('visible-rooms')
  async getActiveRooms(@GetUser() user: User): Promise<RoomInfo[]> {
    return await this.prisma.returnUserVisibleRooms(user.id);
  }
}
