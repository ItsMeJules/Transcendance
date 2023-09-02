import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { GetUser } from 'src/auth/decorator';
import { GameDto } from './dto/game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { GameStruct } from './game.class';
import { match } from 'assert';
import { PongEvents } from './pong.gateway';

@Injectable()
export class GameService {

  constructor() { }

}