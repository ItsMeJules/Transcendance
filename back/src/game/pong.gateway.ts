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
import { User } from '@prisma/client';
import { use } from 'passport';

export type SpectatorMap = Map<number, number>; // <userId, gameId

@WebSocketGateway({ namespace: 'game' })
export class PongEvents {
  @WebSocketServer()
  server: Server;
  idToSocketMap = new Map<number, Socket>();
  public spectatorsMap = new Map<number, number>;

  constructor(
    public pongService: PongService,
    private authService: AuthService,
    private userService: UserService,
  ) { }

  getSocketById(userId: number) {
    return this.idToSocketMap.get(userId);
  }

  async handleConnection(client: Socket) {
    console.log('1 connectin in');
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
      watchingGameId: this.spectatorsMap.get(user.id),
    };
    if (this.pongService.onlineGames) {
      this.pongService.onlineGames.forEach((value, key) => {
        // console.log('uid:', user.id, ' pl1id:', value.pl1.id, ' pl2id:', value.pl2.id)
        if (user.id === value.pl1.id || user.id === value.pl2.id) {
          // console.log('OKKKKKKKKK value room:', value.prop.room);
          client.data.gameId = value.prop.id;
          client.data.room = value.prop.room;
          client.join(value.prop.room);
          // console.log('on connection joined room:', `${value.prop.room}`);
        }
      });
      if (client.data.watchingGameId !== undefined)
        client.join(`game_${client.data.watchingGameId}`);
    }
    client.join(`user_${user.id}`);
    client.join('game_online');
    this.idToSocketMap.set(user.id, client);
    // console.log('OUT client data:', client.data);
    // console.log('id to socket map:', this.idToSocketMap);
    console.log('2 connectin out');
  }

  async handleDisconnect(client: Socket) {
    console.log('3 disconnect');
    const user = await this.userService.findOneById(client.data.id);
    if (!user) return;
    this.pongService.removeFromQueue(user.id);
    this.idToSocketMap.delete(user.id);
    const socketId = client.handshake.query.userId;
  }

  @SubscribeMessage('joinGameQueue')
  async joinQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameDto: GameDto) {
    console.log('Matchmaking - gameMode:', gameDto);

    const access_token = extractAccessTokenFromCookie(client);
    if (!client.data.id || !access_token) {
      client.disconnect();
      return;
    }
    const user = await this.authService.validateJwtToken(access_token);
    if (!user) return;
    const gameQueue = this.pongService.addToQueue(user, gameDto);
    console.log('queue:', this.pongService.userQueue);
    if (gameQueue != null) {
      this.server.to(`user_${user.id}`).emit(`joinGameQueue`, { status: 'JOINED', gameMode: gameDto.gameMode });
      const gameData = await this.pongService.gameCreate(gameDto, this.server);
      if (!gameData) return;
      let gameMode = parseInt(gameDto.gameMode);
      const game = new GameStruct(gameMode, gameData.gameId, gameData.player1Id,
        gameData.player2Id, gameData.gameChannel, this, this.pongService);
      if (!gameData) return; // correct error handling 
      this.pongService.onlineGames.set(game.prop.id, game);
      const player1 = await this.userService.findOneById(game.pl1.id);
      const player2 = await this.userService.findOneById(game.pl2.id);
      const data = { status: 'START', gameChannel: game.prop.room, game: gameData, player1: player1, player2: player2 };
      const player1socket = this.getSocketById(game.pl1.id);
      const player2socket = this.getSocketById(game.pl2.id);
      this.server.to(`user_${game.pl1.id}`).emit(`joinGameQueue`, data);
      this.server.to(`user_${game.pl2.id}`).emit(`joinGameQueue`, data);
      if (player1socket !== undefined) {
        player1socket.join(`game_${game.prop.id}`);
        player1socket.data.room = `game_${game.prop.id}`;
        player1socket.data.gameId = game.prop.id;
      }
      if (player2socket !== undefined) {
        player2socket.join(`game_${game.prop.id}`);
        player2socket.data.room = `game_${game.prop.id}`;
        player2socket.data.gameId = game.prop.id;
      }
      this.updateEmitOnlineGames('toRoom', 0);
    }
  }

  async updateEmitOnlineGames(type: string, userId: number) {
    const dataMap = new Map<number, { player1: User, player1Score: number, player2: User, player2Score: number }>();
    for (const [key, value] of this.pongService.onlineGames.entries()) {
      value.prop.id
      let player1 = await this.userService.findOneById(value.pl1.id);
      let player1Score = value.pl1.score;
      let player2 = await this.userService.findOneById(value.pl2.id);
      let player2Score = value.pl2.score;
      let players = { player1, player1Score, player2, player2Score };
      dataMap.set(key, players);
    };
    const dataObject = {};
    dataMap.forEach((value, key) => {
      dataObject[key] = value;
    });
    if (type === 'toUser')
      this.server.to(`user_${userId}`).emit('onlineGames', dataObject);
    else if (type === 'toRoom')
      this.server.to('onlineGames').emit('onlineGames', dataObject);
    // console.log('online games data Map:', dataObject);
  }

  @SubscribeMessage('onlineGames')
  async getOnlineGames(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { action: string, gameId: string }) {
    const access_token = extractAccessTokenFromCookie(client);
    if (!client.data.id || !access_token) {
      client.disconnect();
      return;
    }
    const user = await this.authService.validateJwtToken(access_token);
    if (!user) {
      client.disconnect();
      return;
    }
    // console.log('IN ONLINE GAMES QUERY and og:', this.pongService.onlineGames);
    if (data.action === 'query') {
      this.updateEmitOnlineGames('toUser', user.id);
      const clientSocket = this.getSocketById(client.data.id);
      clientSocket.join('onlineGames');
    }
  }

  @SubscribeMessage('leaveGameQueue')
  async leaveQueue(
    @ConnectedSocket() client: Socket) {
    const access_token = extractAccessTokenFromCookie(client);
    if (!client.data.id || !access_token) {
      client.disconnect();
      return;
    }
    const user = await this.authService.validateJwtToken(access_token);
    if (!user) return;
    this.server.to(`user_${user.id}`).emit(`joinGameQueue`, { status: 'LEAVE', gameMode: 0 });
    this.pongService.removeFromQueue(user.id);
    // confirm leaving the queue?
  }

  @SubscribeMessage('prepareToPlay')
  async handlePlayerReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { player: string, action: string }) {

    // console.log('prepare client data:', client.data);

    const access_token = extractAccessTokenFromCookie(client);
    if (!client.data.id || !client.data.gameId || !access_token) {
      if (!client.data.gameId) {
        this.server.to(`user_${client.data.id}`).emit('noGame', { status: 'noGame' });
      }
      client.disconnect();
      return;
    }
    // check game id if in game room or not otherwise emit nogame:
    const gameId = parseInt(client.data.gameId);
    const user = await this.authService.validateJwtToken(access_token);
    const gameStruct = this.pongService.getGameStructById(gameId);
    if (!user || !gameStruct) {
      client.disconnect();
      return;
    }
    let player: Player;
    let opponent: Player;
    const playerNum = await this.pongService.getPlayerById(gameStruct.prop.id, user.id);
    if (playerNum === 1) {
      player = gameStruct.pl1;
      opponent = gameStruct.pl2;
    } else if (playerNum === 2) {
      player = gameStruct.pl2;
      opponent = gameStruct.pl1;
    } else
      return;

    // Status
    if (data.action === 'status') {
      gameStruct.sendUpdateToPlayer(player, opponent.status, gameStruct.prop.countdown, 'prepareToPlay');
      return;
    }
    // Wait for opponent
    else if (data.action === 'playPressed' && opponent.status === 'pending') {
      player.status = 'ready';
      gameStruct.prop.status = 'waiting';
      gameStruct.sendUpdateToPlayer(player, opponent.status, -1, 'prepareToPlay');
      const timeoutInSeconds = 10;
      setTimeout(() => {
        if (opponent.status === 'pending'
          && gameStruct.prop.status === 'waiting') {
          gameStruct.prop.status = 'timeout';
          gameStruct.sendUpdateToRoom(player.status, opponent.status, -1, 'prepareToPlay');
          this.pongService.deleteGamePrisma(gameStruct.prop.id);
        }
      }, timeoutInSeconds * 1000);
      this.pongService
    }
    // Both ready launch game
    else if (data.action === 'playPressed' && opponent.status === 'ready') {
      player.status = 'ready';
      gameStruct.sendUpdateToRoom(player.status, opponent.status, gameStruct.prop.countdown, 'prepareToPlay');
      await this.launchCountdown(gameStruct);
      if (gameStruct.prop.status === 'giveUp') return;
      gameStruct.prop.status = 'playing';
      gameStruct.prop.tStart = Date.now();
      gameStruct.sendUpdateToRoom(player.status, opponent.status, -1, 'prepareToPlay');
      gameStruct.sendUpdateToRoom(player.status, opponent.status, -1, 'refreshGame');
      await gameStruct.startGameLoop();
    }
  }

  async launchCountdown(gameStruct: GameStruct) {
    gameStruct.prop.status = 'countdown';
    gameStruct.pl1.status = 'playing';
    gameStruct.pl2.status = 'playing';
    for (let i = 3; i >= 0; i--) {
      gameStruct.prop.countdown = i;
      if (gameStruct.prop.status !== 'giveUp')
        gameStruct.sendUpdateToRoom('playing', 'playing', gameStruct.prop.countdown, 'prepareToPlay');
      else
        return;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    // await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  verifyIfPlayer(room) {
    if (room === undefined)
      return false;
    return true;
  }

  @SubscribeMessage('watchGame')
  async watchGame(@ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string }) {
    // console.log('1 watch spectator:', this.spectatorsMap);
    // console.log('Client entering dataspectator:', client.data);
    const access_token = extractAccessTokenFromCookie(client);
    if ((!client.data.id || !access_token || !data.gameId)
      || (!client.data.watchGame && data.gameId && parseInt(data.gameId)) === -1) {
      this.server.to(`user_${client.data.id}`).emit('noGame', { status: 'noGame' });
      client.disconnect();
      return;
    }
    const clientId = parseInt(client.data.id);
    const gameId = parseInt(data.gameId);
    const game = gameId === -1 ?
      this.pongService.getGameStructById(parseInt(client.data.watchGame)) :
      this.pongService.getGameStructById(gameId);
    if (!game) {
      // console.log('this one!!!!!!');
      this.server.to(`user_${client.data.id}`).emit('noGame', { status: 'noGame' });
      return;
    }
    const clientSocket = this.getSocketById(client.data.id);
    if (!clientSocket) return  // error handling?
    const player1 = await this.userService.findOneById(game.pl1.id);
    const player2 = await this.userService.findOneById(game.pl2.id);
    this.spectatorsMap.set(clientId, gameId);
    client.data.watchGame = gameId;
    clientSocket.join(`game_${game.prop.id}`);

    const dataToSend = { status: 'OK', gameState: game.getState(), player1: player1, player2: player2 }
    this.server.to(`user_${client.data.id}`).emit('watchGame', dataToSend);
    // console.log('2 watch spectator:', this.spectatorsMap);
  }

  @SubscribeMessage('giveUp')
  async giveUpGame(@ConnectedSocket() client: Socket,
    @MessageBody() data: { player: string, action: string }) {
    const access_token = extractAccessTokenFromCookie(client);
    if (!client.data.id || !client.data.gameId || !access_token) {
      if (!client.data.gameId && client.data.id)
        this.server.to(`user_${client.data.id}`).emit('prepareToPlay', { gameStatus: 'noGame' });
      client.disconnect();
      return;
    }
    if (data.action !== 'giveUp') return;
    const gameId = parseInt(client.data.gameId);
    const user = await this.authService.validateJwtToken(access_token);
    const gameStruct = this.pongService.getGameStructById(gameId);
    if (!gameStruct) return;
    let player: Player;
    let opponent: Player;
    const playerNum = await this.pongService.getPlayerById(gameStruct.prop.id, user.id); // error handling
    if (playerNum === 1) {
      player = gameStruct.pl1;
      opponent = gameStruct.pl2;
    } else if (playerNum === 2) {
      player = gameStruct.pl2;
      opponent = gameStruct.pl1;
    } else
      return;
    if (gameStruct.prop.status !== 'ended') {
      gameStruct.stopGameLoop();
      gameStruct.prop.status = 'giveUp';
      player.status = 'givenUp';
      await this.pongService.giveUpGame(gameStruct, opponent, player, true);

      gameStruct.sendUpdateToRoom(player.status, opponent.status, -1, 'refreshGame');
      this.updateEmitOnlineGames('toRoom', 0);
    }
  }

  @SubscribeMessage('moveUp')
  async moveUp(@ConnectedSocket() client: Socket) {
    if (!this.verifyIfPlayer(client.data.room)
      || !client.data.id
      || !client.data.gameId) return;
    const game = this.pongService.getGameStructById(client.data.gameId);
    if (game === undefined || game === null) return;
    if (game.prop.status === 'playing') {
      let player: Player;
      if (client.data.id === game.pl1.id) player = game.pl1;
      else if (client.data.id === game.pl2.id) player = game.pl2;
      if (player === undefined) return; // what about spectators?
      game.movePlayerUp(player);
      return;
    }
  }

  @SubscribeMessage('unpressUp')
  async stopMoveUp(@ConnectedSocket() client: Socket) {
    if (!this.verifyIfPlayer(client.data.room)
      || !client.data.id
      || !client.data.gameId) return;
    const game = this.pongService.getGameStructById(client.data.gameId);
    if (game === undefined || game === null) return;
    if (game.prop.status === 'playing') {
      let player: Player;
      if (client.data.id === game.pl1.id) player = game.pl1;
      else if (client.data.id === game.pl2.id) player = game.pl2;
      if (player.isMoving && player.movingDir === 'up') {
        player.isMoving = false;
        player.movingDir = '';
      }
      return;
    }
  }

  @SubscribeMessage('moveDown')
  async moveDown(@ConnectedSocket() client: Socket) {
    if (!this.verifyIfPlayer(client.data.room)
      || !client.data.id
      || !client.data.gameId) return;
    const game = this.pongService.getGameStructById(client.data.gameId);
    if (game === undefined || game === null) return;
    if (game.prop.status === 'playing') {
      let player: Player;
      if (client.data.id === game.pl1.id) player = game.pl1;
      else if (client.data.id === game.pl2.id) player = game.pl2;
      if (player === undefined) return; // what about spectators?
      game.movePlayerDown(player);
      return;
    }
  }

  @SubscribeMessage('unpressDown')
  async stopMoveDown(@ConnectedSocket() client: Socket) {
    if (!this.verifyIfPlayer(client.data.room)
      || !client.data.id
      || !client.data.gameId) return;
    const game = this.pongService.getGameStructById(client.data.gameId);
    if (game === undefined || game === null) return;
    if (game.prop.status === 'playing') {
      let player: Player;
      if (client.data.id === game.pl1.id) player = game.pl1;
      else if (client.data.id === game.pl2.id) player = game.pl2;
      if (player.isMoving && player.movingDir === 'down') {
        player.isMoving = false;
        player.movingDir = '';
      }
      return;
    }
  }

}

// const sockets = await this.server.in(gameStruct.prop.room).fetchSockets();
// sockets.forEach((Socket) => {
//   console.log('IN room user:', Socket.data);
// });