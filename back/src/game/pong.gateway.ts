import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
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
import { PongStoreService } from 'src/utils/pong-store/pong-store.service';
import { disconnect } from 'process';

export type SpectatorMap = Map<number, number>; // <userId, gameId
export type PlayersMap = Map<number, number>; // <userId, gameId

@WebSocketGateway({ namespace: 'game' })
export class PongEvents {
  @WebSocketServer()
  server: Server;
  public idToSocketMap = new Map<number, Socket>();
  public spectatorsMap = new Map<number, number>;
  public playersMap = new Map<number, number>; // <userId, GameId>

  constructor(
    public pongService: PongService,
    private authService: AuthService,
    private userService: UserService) { }

  async handleConnection(client: Socket) {

    const access_token = extractAccessTokenFromCookie(client);
    if (!access_token) {
      client.disconnect();
      return;
    }
    const user = await this.authService.validateJwtToken(access_token);
    console.log(' ');
    console.log(' ');
    console.log('1 IN id:', user.id);
    if (!user) {
      client.disconnect();
      return;
    }
    const gameId = this.playersMap.get(user.id);
    client.data = { id: user.id, username: user.username };
    this.idToSocketMap.set(user.id, client);
    client.join(`user_${user.id}`);
    client.join('game_online');
    if (this.pongService.onlineGames) {
      const gameId = this.playersMap.get(user.id);
      if (gameId)
        client.join(`game_${gameId}`);
      const gameWatchId = this.spectatorsMap.get(user.id);
      if (gameWatchId)
        client.join(`game_${gameWatchId}`);
    }
  }

  async handleDisconnect(client: Socket) {
    const user = await this.userService.findOneById(client.data.id);
    if (!user) return;
    this.pongService.removeFromQueue(user.id);
    this.spectatorsMap.delete(user.id);
    this.idToSocketMap.delete(user.id);
  }

  @SubscribeMessage('joinGameQueue')
  async joinQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameDto: GameDto) {
    const access_token = extractAccessTokenFromCookie(client);
    if (!client.data.id || !access_token) {
      client.disconnect();
      return;
    }
    const user = await this.authService.validateJwtToken(access_token);
    if (!user) return;
    console.log(' ');
    console.log(' ');
    console.log('2 JOINE GAME QUEUE id:', user.id);

    const gameId = this.playersMap.get(user.id);
    if (gameId !== undefined) {
      console.log('2 RETURN game existing id:', gameId)
      this.server.to(`user_${user.id}`).emit(`joinGameQueue`, { status: 'INGAME', gameMode: 0 });
      return;
    }
    const gameQueue = this.pongService.addToQueue(user, gameDto);
    console.log('2 Queue:', this.pongService.userQueue);
    if (gameQueue != null) {
      console.log('2 EMIT JOINED to user:', user.id);
      this.server.to(`user_${user.id}`).emit(`joinGameQueue`, { status: 'JOINED', gameMode: gameDto.gameMode });
      const gameData = await this.pongService.gameCreate(gameDto, this.server); // not await?
      if (!gameData) return;
      console.log('2 GAME CREATED');
      let gameMode = parseInt(gameDto.gameMode);
      const game = new GameStruct(gameMode, gameData.gameId, gameData.player1Id,
        gameData.player2Id, gameData.gameChannel, this, this.pongService);
      this.pongService.onlineGames.set(game.prop.id, game);
      const player1 = await this.userService.findOneById(game.pl1.id);
      const player2 = await this.userService.findOneById(game.pl2.id);
      const player1socket = this.idToSocketMap.get(game.pl1.id);
      const player2socket = this.idToSocketMap.get(game.pl2.id);
      if (player1socket === undefined || player2socket === undefined) {
        this.pongService.deleteGamePrismaAndList(game.prop.id)
        return;
      }
      player1socket.join(`game_${game.prop.id}`);
      player2socket.join(`game_${game.prop.id}`);
      this.playersMap.delete(player1.id);
      this.playersMap.delete(player2.id);
      this.playersMap.set(player1.id, game.prop.id);
      this.playersMap.set(player2.id, game.prop.id);
      const data = { status: 'START', gameChannel: game.prop.room, game: gameData, player1: player1, player2: player2 };
      console.log('2 EMIT GAME START in joinGameQueue TO:');
      this.printUsersInRoom(`game_${game.prop.id}`);
      this.server.to(`game_${game.prop.id}`).emit(`joinGameQueue`, data);
      // this.server.to(`user_${game.pl1.id}`).emit(`joinGameQueue`, data);
      // this.server.to(`user_${game.pl2.id}`).emit(`joinGameQueue`, data);
      this.updateEmitOnlineGames('toRoom', 0);
      // this.allUsersUpdater();
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
      const clientSocket = this.idToSocketMap.get(client.data.id);
      if (clientSocket) clientSocket.join('onlineGames');
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
  }

  @SubscribeMessage('prepareToPlay')
  async handlePlayerReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { player: string, action: string }) {


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
    console.log(' ');
    console.log(' ');
    console.log('3 PREPARE TO PLAY id:', user.id);
    const gameId = this.playersMap.get(user.id);
    const gameStruct = this.pongService.getGameStructById(gameId);
    if (!gameId || !gameStruct) {
      if (gameId && !gameStruct)
        this.playersMapDeleteGameById(gameId);
      console.log('3 NO GAME');
      this.server.to(`user_${user.id}`).emit('noGame', { status: 'noGame' });
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
      console.log('3 ACTION STATUS');
      gameStruct.sendUpdateToPlayer(player, opponent.status, gameStruct.prop.countdown, 'prepareToPlay');
      return;
    }
    // Wait for opponent
    else if (data.action === 'playPressed' && opponent.status === 'pending') {
      console.log('3 WAIT FOR OPPONENT');
      player.status = 'ready';
      gameStruct.prop.status = 'waiting';
      gameStruct.sendUpdateToPlayer(player, opponent.status, -1, 'prepareToPlay');
      const timeoutInSeconds = 10;
      setTimeout(() => {
        if (opponent.status === 'pending'
          && gameStruct.prop.status === 'waiting') {
          console.log('TIMEOUT');
          gameStruct.prop.status = 'timeout';
          gameStruct.sendUpdateToRoom(player.status, opponent.status, -1, 'prepareToPlay');
          this.pongService.deleteGamePrismaAndList(gameStruct.prop.id);
        }
      }, timeoutInSeconds * 1000);
    }
    // Both ready launch game
    else if (data.action === 'playPressed' && opponent.status === 'ready') {
      console.log('3 BOTH READY GO');
      player.status = 'ready';
      gameStruct.sendUpdateToRoom(player.status, opponent.status, gameStruct.prop.countdown, 'prepareToPlay');
      await this.launchCountdown(gameStruct);
      if (gameStruct.prop.status === 'giveUp') return;
      gameStruct.prop.status = 'playing';
      gameStruct.prop.tStart = Date.now();
      console.log('3 EMIT TO prepareToPlay and refreshGame TO:');
      this.printUsersInRoom(gameStruct.prop.room);
      gameStruct.sendUpdateToRoom(player.status, opponent.status, -1, 'prepareToPlay');
      gameStruct.sendUpdateToRoom(player.status, opponent.status, -1, 'refreshGame');
      await gameStruct.startGameLoop(); // remove await?
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
  }

  @SubscribeMessage('watchGame')
  async watchGame(@ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string }) {
    const access_token = extractAccessTokenFromCookie(client);
    if ((!client.data.id || !access_token)) {
      this.server.to(`user_${client.data.id}`).emit('noGame', { status: 'noGame' });
      client.disconnect();
      return;
    }
    const user = await this.authService.validateJwtToken(access_token);
    console.log('5 WATCH WITH ID:', user.id, ' AND GAMEID:', data.gameId);
    const gameId = parseInt(data.gameId);
    console.log('5 WATCH GAME ID:', gameId)
    const game = gameId === -1 ?
      this.pongService.getGameStructById(this.spectatorsMap.get(user.id)) :
      this.pongService.getGameStructById(gameId);
    const isUserInGame = this.playersMap.get(user.id);
    this.pongService.onlineGames.forEach((value, key) => {
      console.log('online games id:', key);
    });
    // console.log('5 pongservice online games:', this.pongService.onlineGames);
    // No game
    if (!game) {
      console.log('5 WATCH NO GAME');
      this.server.to(`user_${client.data.id}`).emit('noGame', { status: 'noGame' });
      return;
    }
    // User is in game redirect to play
    else if (isUserInGame !== undefined) {
      console.log('5 WATCH IN GAME');
      this.server.to(`user_${client.data.id}`).emit('inGame', { status: 'inGame' });
      return;
    }
    const clientSocket = this.idToSocketMap.get(user.id);
    if (!clientSocket) return  // error handling?
    const player1 = await this.userService.findOneById(game.pl1.id);
    const player2 = await this.userService.findOneById(game.pl2.id);
    this.spectatorsMap.set(user.id, gameId);
    clientSocket.join(`game_${game.prop.id}`);
    const dataToSend = { status: 'OK', gameState: game.getState(), player1: player1, player2: player2 }
    this.server.to(`user_${client.data.id}`).emit('watchGame', dataToSend);
    console.log('ok here emit watch game');
    console.log('2 watch spectator:', this.spectatorsMap);
    const sockets = await this.server.in(`game_${game.prop.id}`).fetchSockets();
    sockets.forEach((Socket) => {
      console.log('IN room user:', Socket.data);
    });
  }

  @SubscribeMessage('giveUp')
  async giveUpGame(@ConnectedSocket() client: Socket,
    @MessageBody() data: { player: string, action: string }) {
    const access_token = extractAccessTokenFromCookie(client);
    if (!client.data.id || !access_token) {
      client.disconnect();
      return;
    }
    if (data.action !== 'giveUp') return;
    const user = await this.authService.validateJwtToken(access_token);
    const gameId = this.playersMap.get(user.id);
    console.log(' ');
    console.log(' ');
    console.log('4 GIVE UP id:', user.id);
    const gameStruct = this.pongService.getGameStructById(gameId);
    if (!gameId || !gameStruct) {
      console.log('4 NO GAME');
      this.server.to(`user_${client.data.id}`).emit('noGame', { status: 'noGame' });
      return;
    }
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
      this.playersMap.delete(player.id);
      this.playersMap.delete(opponent.id);
      console.log('4 EMIT TO ROOM:', gameStruct.prop.room);
      console.log('4 WITH USERS IN ROOM:');
      this.printUsersInRoom(gameStruct.prop.room);
      gameStruct.sendUpdateToRoom(player.status, opponent.status, -1, 'refreshGame');
      gameStruct.sendUpdateToRoom(player.status, opponent.status, -1, 'prepareToPlay');
      this.updateEmitOnlineGames('toRoom', 0);
      // this.allUsersUpdater();
    }
  }

  @SubscribeMessage('moveUp')
  async moveUp(@ConnectedSocket() client: Socket) {
    if (!client.data.id) return;
    const gameId = this.playersMap.get(client.data.id);
    const game = this.pongService.getGameStructById(gameId);
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
    if (!client.data.id) return;
    const gameId = this.playersMap.get(client.data.id);
    const game = this.pongService.getGameStructById(gameId);
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
    if (!client.data.id) return;
    const gameId = this.playersMap.get(client.data.id);
    const game = this.pongService.getGameStructById(gameId);
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
    if (!client.data.id) return;
    const gameId = this.playersMap.get(client.data.id);
    const game = this.pongService.getGameStructById(gameId);
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

  playersMapDeleteGameById(gameIdToDelete: number) {
    for (const [userId, gameId] of this.playersMap.entries()) {
      if (gameId === gameIdToDelete) {
        this.playersMap.delete(userId);
      }
    }
  }

  // @SubscribeMessage('allUsers') // This decorator listens for messages with the event name 'message'
  // async allUsersHandler(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() data: { action: string }) {
  //   console.log('All users and status:', data.action);

  //   if (!client.data.id) {
  //     client.disconnect();
  //     return;
  //   }
  //   const userId = parseInt(client.data.id);
  //   // protect and manage errors
  //   const allUsers = await this.prismaService.user.findMany({
  //     orderBy: {
  //       username: 'asc',
  //     }
  //   });
  //   console.log('playersMap:', this.pongEvents.playersMap);
  //   allUsers.forEach((user) => {
  //     delete user.hash;
  //     const isPlaying = this.pongEvents.playersMap.get(user.id);
  //     user.isPlaying = isPlaying !== undefined ? true : false;
  //     const isOnline =  isPlaying ? true : this.idToSocketMap.get(user.id);
  //     user.isOnline = isOnline !== undefined ? true : false;
  //   });
  //   console.log('all users list:', allUsers);
  //   this.server.to(`user_${userId}`).emit('allUsers', allUsers);
  // }


  // @SubscribeMessage('allUsers') // This decorator listens for messages with the event name 'message'
  // async allUsersHandler(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() data: { action: string }) {
  //   console.log('All users and status:', data.action);

  //   if (!client.data.id) {
  //     client.disconnect();
  //     return;
  //   }
  //   const userId = parseInt(client.data.id);
  //   // protect and manage errors
  //   const allUsers = await this.pongService.prismaService.user.findMany({
  //     orderBy: {
  //       username: 'asc',
  //     }
  //   });
  //   console.log('playersMap:', this.playersMap);
  //   allUsers.forEach((user) => {
  //     delete user.hash;
  //     const isPlaying = this.playersMap.get(user.id);
  //     user.isPlaying = isPlaying !== undefined ? true : false;
  //     const isOnline =  isPlaying ? true : this.idToSocketMap.get(user.id);
  //     user.isOnline = isOnline !== undefined ? true : false;
  //   });
  //   console.log('all users list:', allUsers);
  //   this.server.to(`user_${userId}`).emit('allUsers', allUsers);
  // }

  async printUsersInRoom(room: string) {
    const sockets = await this.server.in(room).fetchSockets();
    console.log('Users in room:', room);
    sockets.forEach((Socket) => {
      console.log(Socket.data.id);
    });
    console.log(' ');
  }

}

// const sockets = await this.server.in(gameStruct.prop.room).fetchSockets();
// sockets.forEach((Socket) => {
//   console.log('IN room user:', Socket.data);
// });
