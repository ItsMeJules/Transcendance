import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  Post,
  UseInterceptors,
  UploadedFile,
  Res,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SocketEvents } from 'src/websocket/websocket.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { diskStorage } from 'multer';
import { editFileName } from './module';
import { Response } from 'express';
import { CompleteRoom, CompleteUser } from 'src/utils/complete.type';
import handleJwtError from '@utils/jwt.error';
import handlePrismaError from '@utils/prisma.error';


@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

  constructor(
    private userService: UserService,
    private prisma: PrismaService,
    private socketEvents: SocketEvents,
  ) {}

  @Get('current-chat')
  getCurrentChat(@GetUser() user: User): string {
    return user.currentRoom;
  }

  @Get('complete-room')
  getCompleteRoom(@GetUser() user: User): Promise<CompleteRoom> {
    return this.prisma.returnCompleteRoom(user.currentRoom);
  }

  @Get('complete-user')
  getCompleteUser(@GetUser() user: User): Promise<CompleteUser> {
    return this.prisma.returnCompleteUser(user.id);
  }

  @Get('me')
  getMe(@GetUser() user: User): User {
    return user;
  }

  @Get('all')
  async findAll() {
    return this.userService.findAll();
  }

  @Get('leaderboard')
  async getLeaderBoard() {
    const all = await this.userService.getLeaderboard();
    return all;
  }

  @Get(':id')
  async findUserById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    try {
      const userMain = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          friends: {
            where: { id: id },
            select: { id: true },
          },
        },
      });
      const user: User | null = await this.prisma.user.findUnique({
        where: { id: id },
      });
      if (userId === id)
        user.id = -1;
      const data: any = {};
      delete user.hash;
      data.user = { user };
      data.isFriend = 'false';
      if (userMain.friends.length !== 0) data.isFriend = 'true';
      return { data };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  @Patch('add-friend/:id')
  async addFriend(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) friendId: number,
  ): Promise<any> {
    return this.userService.addFriendToggler(userId, friendId);
  }

  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  @Post('pf')
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: 'public/images/',
        filename: editFileName,
      }),
    }),
  )

  async uploadProfilePic(@GetUser() user: User, @UploadedFile() file) {
    return this.userService.uploadProfilePic(user, file);
  }

  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.json({ message: 'Logout successful' });
  }

  @Get('me/2fa-state')
  getTwoFactorAuthenticationState(@GetUser() user: User): boolean {
    return user.isTwoFactorAuthenticationEnabled;
  }
}
