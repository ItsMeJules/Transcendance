import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PongService } from './pong.service';
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
    private readonly pongService: PongService,
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
    client.data = { id: user.id, gameId: '' };
    client.join(`user_${user.id}`);
    client.join('game_online');
    this.idToSocketMap.set(user.id, client);
    // console.log('socket:', client);

  }

  async handleDisconnect(client: Socket) {
    console.log('> game Connection out');
    const user = await this.userService.findOneById(client.data.id);
    if (!user) return;
    this.pongService.removeFromQueue(user.id);
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
    const gameQueue = this.pongService.addToQueue(user, gameDto);
    if (gameQueue != null) {
      this.server.to(`user_${user.id}`).emit(`joinGameQueue`, { status: 'JOINED' });
      const gameStructure = await this.pongService.gameStart(gameDto, this.server);
      if (gameStructure) {
        const player1socket = this.getSocketById(gameStructure.player1.id);
        const player2socket = this.getSocketById(gameStructure.player2.id);
        this.server.to(`user_${gameStructure.player1.id}`).emit(`joinGameQueue`, gameStructure);
        this.server.to(`user_${gameStructure.player2.id}`).emit(`joinGameQueue`, gameStructure);
        player1socket.join(`game_${gameStructure.game.id}`);
        player2socket.join(`game_${gameStructure.game.id}`);

        // Check if gameId is empty?
        player1socket.data.gameId = gameStructure.game.id;
        player2socket.data.gameId = gameStructure.game.id;
      }
    }
  }

  @SubscribeMessage('leaveGameQueue') // This decorator listens for messages with the event name 'message'
  async leaveQueue(
    @ConnectedSocket() client: Socket) {
    console.log('Leave queue');
    const user = await this.userService.findOneById(client.data.id);
    if (!user) return;
    this.pongService.removeFromQueue(user.id);
    // confirm leaving the queue?
  }

  @SubscribeMessage('game')
  async handleGame(
    @ConnectedSocket() client: Socket) {

  }

  @SubscribeMessage('playerReady')
  async handlePlayerReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { player: string }) {

    const playerId = client.data.id;
    if (!playerId) return;
    console.log('client.data.gameId:', client.data.gameId);
    const gameId = client.data.gameId;
    const gameStruct = this.pongService.getGameStructById(gameId);
    console.log('GameStruct:', gameStruct);
    gameStruct.setPlayerReady(playerId);

    
    if (gameStruct.bothPlayersReady()) {
      gameStruct.tStart = Date.now()
      this.server.to(gameStruct.room).emit('game', 'PLAY');
    }
    // // Check if both players are ready
    // if (this.playersReady['player1'] && this.playersReady['player2']) {
    //   // Reset readiness for the next round
    //   this.playersReady['player1'] = false;
    //   this.playersReady['player2'] = false;

    //   // Notify both players to start the countdown
    //   this.server.to('game_ID').emit('startCountdown');


  }

}
