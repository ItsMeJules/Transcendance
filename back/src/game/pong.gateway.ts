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
import { GameStruct } from './game.class';
import { Player } from './models/player.model';

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
    console.log('IN client data:', client.data);
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
    client.data = {
      id: user.id,
      username: user.username,
      gameId: undefined,
      room: undefined,
    };
    if (this.pongService.onlineGames) {
      this.pongService.onlineGames.forEach((value, key) => {
        console.log('uid:', user.id, ' pl1id:', value.player1.id, ' pl2id:', value.player2.id)
        if (user.id === value.player1.id || user.id === value.player2.id) {
          console.log('OKKKKKKKKK value room:', value.room);
          client.data.gameId = value.id;
          client.data.room = value.room;
          client.join(value.room);
          console.log('on connection joined room:', `${value.room}`);
        }
      });
    }
    client.join(`user_${user.id}`);
    client.join('game_online');
    this.idToSocketMap.set(user.id, client);
    console.log('OUT client data:', client.data);
    // console.log('id to socket map:', this.idToSocketMap);

  }

  async handleDisconnect(client: Socket) {
    // console.log('> game Connection out');
    const user = await this.userService.findOneById(client.data.id);
    if (!user) return;
    this.pongService.removeFromQueue(user.id);
    this.idToSocketMap.delete(user.id);
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
      const gameStructure = await this.pongService.gameCreate(gameDto, this.server);
      if (gameStructure) {
        const player1socket = this.getSocketById(gameStructure.player1.id);
        const player2socket = this.getSocketById(gameStructure.player2.id);
        this.server.to(`user_${gameStructure.player1.id}`).emit(`joinGameQueue`, gameStructure);
        this.server.to(`user_${gameStructure.player2.id}`).emit(`joinGameQueue`, gameStructure);
        player1socket.join(`game_${gameStructure.game.id}`);
        player2socket.join(`game_${gameStructure.game.id}`);
        player1socket.data.room = `game_${gameStructure.game.id}`;
        player2socket.data.room = `game_${gameStructure.game.id}`;
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

  @SubscribeMessage('prepareToPlay')
  async handlePlayerReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { player: string, action: string }) {

    const access_token = extractAccessTokenFromCookie(client);
    if (!client.data.id || !client.data.gameId || !access_token) {
      client.disconnect();
      return;
    }
    const user = await this.authService.validateJwtToken(access_token);
    const gameStruct = this.pongService.getGameStructById(client.data.gameId);
    if (!user || !gameStruct) {
      client.disconnect();
      return;
    }
    let player: Player;
    let opponent: Player;
    const playerNum = await this.pongService.getPlayerById(gameStruct.id, user.id);
    if (playerNum === 1) {
      player = gameStruct.player1;
      opponent = gameStruct.player2;
    } else if (playerNum === 2) {
      player = gameStruct.player2;
      opponent = gameStruct.player1;
    } else
      return;

    // Status
    if (data.action === 'status') {
      this.server.to(`user_${user.id}`).emit('prepareToPlay',
        {
          gameStatus: gameStruct.status,
          playerStatus: player.status,
          opponentStatus: opponent.status,
          countdown: gameStruct.countdown,
        });
      return;
    }
    // Wait for opponent
    else if (data.action === 'playPressed' && opponent.status === 'pending') {
      player.status = 'ready';
      gameStruct.status = 'waiting';
      this.server.to(`user_${user.id}`).emit('prepareToPlay',
        {
          gameStatus: gameStruct.status,
          playerStatus: player.status,
          opponentStatus: opponent.status
        });
      const timeoutInSeconds = 10;
      setTimeout(() => {
        if (opponent.status === 'pending') {
          gameStruct.status = 'timeout';
          this.server.to(gameStruct.room).emit('prepareToPlay', { gameStatus: gameStruct.status });
          this.pongService.deleteGame(gameStruct.id);
        }
      }, timeoutInSeconds * 1000);
      this.pongService
    }
    // Both ready launch game 
    else if (data.action === 'playPressed' && opponent.status === 'ready') {
      player.status = 'ready';
      gameStruct.status = 'countdown';

      this.server.to(gameStruct.room).emit('prepareToPlay',
        {
          gameStatus: gameStruct.status,
          playerStatus: player.status,
          opponentStatus: opponent.status
        });
      // Countdown activity
      await new Promise((resolve) => setTimeout(resolve, 1000));
      gameStruct.countdown = 3;
      this.server.to(gameStruct.room).emit('prepareToPlay', { gameStatus: 'countdown', countdown: gameStruct.countdown });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      gameStruct.countdown = 2;
      this.server.to(gameStruct.room).emit('prepareToPlay', { gameStatus: 'countdown', countdown: gameStruct.countdown });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      gameStruct.countdown = 1;
      this.server.to(gameStruct.room).emit('prepareToPlay', { gameStatus: 'countdown', countdown: gameStruct.countdown });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      gameStruct.countdown = 0;
      this.server.to(gameStruct.room).emit('prepareToPlay', { gameStatus: 'countdown', countdown: 'GO!' });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      gameStruct.status = 'playing';
      gameStruct.player1.status = 'playing';
      gameStruct.player2.status = 'playing';
      gameStruct.tStart = Date.now();
      this.server.to(gameStruct.room).emit('prepareToPlay', { gameStatus: 'playing', gameState: gameStruct.getState(), time: Date.now() });
    }
    // const sockets = await this.server.in(gameStruct.room).fetchSockets();
    // sockets.forEach((Socket) => {
    //   console.log('IN room user:', Socket.data);
    // });
  }

}
