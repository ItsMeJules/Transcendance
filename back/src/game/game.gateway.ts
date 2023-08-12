import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { extractAccessTokenFromCookie } from 'src/utils';
import { AuthService } from '../auth/auth.service';
import { GameDto } from './dto/game.dto';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({ namespace: 'game' })
export class GameEvents {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gameService: GameService,
    private authService: AuthService,
    private userService: UserService,
  ) { }

  async handleConnection(client: Socket) {
    console.log('> game Connection in');
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
    // console.log('Connect:', `user_${user.id}`)
    client.join(`user_${user.id}`);
    client.join('game_online');

    // this.server.emit('general_online', 'Hi all!');
    // this.server.emit(`user_${client.data.id}`, `Hi user number ${client.data.id}`);
    // console.log('test:', `user_${client.data.id}`);
  }


  handleDisconnect(client: Socket) {
    console.log('> game Connection out');
    if (client.data.id)
      this.gameService.removeFromQueue(client.data.id);
    const socketId = client.handshake.query.userId;
    // console.log("users:", this.connectedUsers);
  }

  @SubscribeMessage('joinGameQueue') // This decorator listens for messages with the event name 'message'
  async joinQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameDto: GameDto) {
    console.log('Matchmaking - gameMode:', gameDto);
    const user = await this.userService.findOneById(client.data.id);
    if (!user) return;
    const gameQueue = this.gameService.addToQueue(user, gameDto);
    if (gameQueue != null) {
      // this.server.emit(`user_${user.id}`, 'You just joined the queue to play!')
      // console.log('Join:', `user_${user.id}`)
      this.server.to(`user_${user.id}`).emit(`joinGameQueue`, 'QUEUE JOINED')
    }
    this.server.emit('matchmaking', 'Message received by server');
  }

  @SubscribeMessage('leaveGameQueue') // This decorator listens for messages with the event name 'message'
  async leaveQueue(
    @ConnectedSocket() client: Socket) {
    console.log('Leave queue');
    const user = await this.userService.findOneById(client.data.id);
    if (!user) return;
    this.gameService.removeFromQueue(user.id);
    // confirm leaving the queue?
  }

}
