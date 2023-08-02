import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  Res,
  Param,
  UseFilters,
  ParseIntPipe,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from './module';
import { Response } from 'express';
import { CustomExceptionFilter } from './module/CustomExceptionFilter';
import { PrismaService } from 'src/prisma/prisma.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService,
    private prisma: PrismaService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
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
  ) {
    if (userId === id)
      return { redirectTo: 'http://localhost:4000/profile/me' };
    try {
      const is_user_friend = await this.prisma.user.findMany({
        where: {
          friends: {
            some: {
              id: id,
            },
          },
        },
      });
      // console.log(is_user_friend);
      const user: User | null = await this.prisma.user.findUnique({
        where: { id: id },
      });
      // console.log(user);
      const data: any = {};
      data.user = {user};
      data.friendStatus = '';
      if (is_user_friend.length !== 0) data.friendStatus = 'Is friend';
      console.log(data);
      return { data };
    } catch (err) {}
    // return this.userService.findOneById(id);
  }

  @Patch('add-friend/:id')
  async addFriend(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) friendId: number,
  ) {
    console.log('firends entered');
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
  @UseFilters(CustomExceptionFilter)
  async uploadProfilePic(@GetUser() user: User, @UploadedFile() file) {
    return this.userService.uploadProfilePic(user, file);
  }

  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.json({ message: 'Logout successful' });
  }
}
