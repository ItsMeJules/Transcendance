import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './websocket.service';
import { extractAccessTokenFromCookie } from 'src/utils';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({ namespace: 'general' })
export class SocketEvents {
  @WebSocketServer()
  server: Server;

  constructor(
    private socketService: SocketService,
    private authService: AuthService,
  ) {}

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
    client.data = { id: user.id };
    client.join(`user_${client.id}`);
    client.join('general_online');
    // this.server.to(`user_${client.id}`).emit('general_online', 'you are on');
    console.log('1 Connection in');
    // if (user.friends)
    // console.log('user:', user.friends);






    // const onlineUsers = await this.server.in('general_online').fetchSockets();
    // // Friends
    // let onlineFriends = [];

    // user.friends.forEach((friends) => {
    //   for (let i = 0; i < onlineUsers.length; i++) {
    //     const socket = onlineUsers[i];
    //     if (friends.id === socket.data.id) {
    //       console.log('friend id:', friends.id, ' socket id:', socket.data.id, " it s a match and is online!");
    //       onlineFriends.push(friends.id);
    //       break;
    //     }
    //   }
    // });






    // console.log('onlinefriends:', onlineFriends);
    // this.server.emit('general_online', onlineFriends);

  }

  // async isFriendOnline(friendId: string): Promise<boolean> {
  //   const room = this.server.sockets.adapter.rooms.get('general_online');

  //   if (room) {
  //     for (const socketId of room) {
  //       const socket = this.server.sockets.sockets.get(socketId);
  //       if (socket.data.id === friendId) {
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // }

  handleDisconnect(client: Socket) {
    console.log('3 Connection out');
    const socketId = client.handshake.query.userId;
    // console.log("users:", this.connectedUsers);
  }

  // @SubscribeMessage('message') // This decorator listens for messages with the event name 'message'
  // handleMessage(client: any, payload: any) {
  //   console.log('Received message:', payload);
  //   this.server.emit('test', 'Message received by server');
  // }

  // @SubscribeMessage('askFriendOnlineStatus')
  // async handleAskFriendOnlineStatus(client: Socket, friendId: string): Promise<boolean> {
  //   const isOnline = await this.isFriendOnline(friendId);
  //   return isOnline;
  // }
}
