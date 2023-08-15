import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './pong.service';
import { extractAccessTokenFromCookie } from 'src/utils';
import { AuthService } from '../auth/auth.service';
import { GameDto } from './dto/game.dto';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({ namespace: 'game' })
export class GameEvents {
  @WebSocketServer()
  server: Server;
  idToSocketMap = new Map<number, Socket>();

  constructor(
    private readonly gameService: GameService,
    private authService: AuthService,
    private userService: UserService,
  ) { }

  getSocketById(userId: number) {
    return this.idToSocketMap.get(userId);
  }

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
    client.join(`user_${user.id}`);
    client.join('game_online');
    this.idToSocketMap.set(user.id, client);
    // console.log('socket:', client);

  }

  async handleDisconnect(client: Socket) {
    console.log('> game Connection out');
    const user = await this.userService.findOneById(client.data.id);
    if (!user) return;
    this.gameService.removeFromQueue(user.id);
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
      this.server.to(`user_${user.id}`).emit(`joinGameQueue`, { status: 'JOINED' });
      const gameStructure = await this.gameService.gameStart(gameDto, this.server);
      if (gameStructure) {
        const player1socket = this.getSocketById(gameStructure.player1.id);
        const player2socket = this.getSocketById(gameStructure.player2.id);
        this.server.to(`user_${gameStructure.player1.id}`).emit(`joinGameQueue`, gameStructure);
        this.server.to(`user_${gameStructure.player2.id}`).emit(`joinGameQueue`, gameStructure);
        player1socket.join(`game_${gameStructure.game.id}`);
        player2socket.join(`game_${gameStructure.game.id}`);
      }
    }
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

  @SubscribeMessage('game')
  async handleGame(
    @ConnectedSocket() client: Socket) {

      
  }

}
