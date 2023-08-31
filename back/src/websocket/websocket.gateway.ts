import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './websocket.service';
import { extractAccessTokenFromCookie } from 'src/utils';
import { AuthService } from '../auth/auth.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { all } from 'axios';
import { PongEvents } from 'src/game/pong.gateway';
import { PongStoreService } from 'src/utils/pong-store/pong-store.service';

@WebSocketGateway({ namespace: 'general' })
export class SocketEvents {
  @WebSocketServer()
  server: Server;
  public idToSocketMap = new Map<number, Socket>();

  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
    private userService: UserService,) { }

  async handleConnection(client: Socket) {
    const access_token = extractAccessTokenFromCookie(client);
    if (!access_token) {
      client.disconnect();
      return;
    }
    const user = await this.authService.validateJwtToken(access_token);
    if (!user) {
      client.disconnect();
      return;
    }
    client.data = { id: user.id, username: user.username };
    this.idToSocketMap.set(user.id, client);
    client.join(`user_${user.id}`);
    client.join('general_online');
  }

  async handleDisconnect(client: Socket) {
    const user = await this.userService.findOneById(client.data.id);
    if (!user) return;
    this.idToSocketMap.delete(user.id);
  }

  @SubscribeMessage('allUsers') // This decorator listens for messages with the event name 'message'
  async allUsersHandler(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { action: string }) {
    console.log('All users and status:', data.action);

    // if (!client.data.id) {
    //   client.disconnect();
    //   return;
    // }
    // const userId = parseInt(client.data.id);
    // // protect and manage errors
    // const allUsers = await this.prismaService.user.findMany({
    //   orderBy: {
    //     username: 'asc',
    //   }
    // });
    // console.log('playersMap:', this.pongStoreService.playersMap);
    // allUsers.forEach((user) => {
    //   delete user.hash;
    //   const isPlaying = this.pongStoreService.playersMap.get(user.id);
    //   user.isPlaying = isPlaying !== undefined ? true : false;
    //   const isOnline =  isPlaying ? true : this.idToSocketMap.get(user.id);
    //   user.isOnline = isOnline !== undefined ? true : false;
    // });
    // console.log('all users list:', allUsers);
    // this.server.to(`user_${userId}`).emit('allUsers', allUsers);
  }
}
