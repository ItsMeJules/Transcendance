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
import { gameEvents } from './game.class';
import { pongServiceEmitter } from './pong.service';
import { userServiceEmitter } from 'src/user/user.service';
import { Interval } from '@nestjs/schedule';
import { DualDto } from './dto/dual.dto';
import handlePrismaError from '@utils/prisma.error';

export type SpectatorMap = Map<number, number>; // <userId, gameId>
export type PlayersMap = Map<number, number>; // <userId, gameId>

@WebSocketGateway({ namespace: 'game' })
export class PongEvents {
  @WebSocketServer()
  server: Server; 
  public idToSocketMap = new Map<number, Socket>();
  public spectatorsMap = new Map<number, number>;
  public playersMap = new Map<number, number>;

  constructor(
    public pongService: PongService,
    private authService: AuthService,
    private userService: UserService,
  ) {
    /* Remove players from players map */
    gameEvents.on('gatewayRemovePlayersFromList', (data) => {
      this.eventRemovePlayersFromList(data);
      const gameIdToDelete = parseInt(data.gameId);
      this.removeSpectatorsFromList(gameIdToDelete);
      this.emitUpdateAllUsers('toAll', 0);
      this.emitUpdateFriendsOf(parseInt(data.pl1Id));
      this.emitUpdateFriendsOf(parseInt(data.pl1Id));
      
    });
    /* Update room */
    gameEvents.on('gatewayUpdateRoom', (data) => {
      this.sendUpdateToRoom(data);
    });
    /* Update online games */
    gameEvents.on('gatewayUpdateOnlineGames', (data) => {
      this.updateEmitOnlineGames('toRoom', 0);
    });
    pongServiceEmitter.on('serviceEndGame', (data) => {
      this.updateEmitOnlineGames('toRoom', 0);
      this.emitUpdateLeaderboard('toRoom', 0);
      this.emitUpdateProfileHeader(parseInt(data.player1Id));
      this.emitUpdateProfileHeader(parseInt(data.player2Id));
    });
    userServiceEmitter.on('updateFriendsOfUser', (data) => {
      this.emitUpdateFriends('toUser', parseInt(data.userId));
    });
    userServiceEmitter.on('refreshHeader', (data) => {
      this.emitUpdateProfileHeader(parseInt(data.userId));
    });
  }

  /* Connect main */
  async handleConnection(client: Socket): Promise<void> {
    const access_token = extractAccessTokenFromCookie(client);
    if (!access_token) return;
    const user = await this.authService.validateJwtToken(access_token, true);
    if (!user) return;
    client.data = { id: user.id, username: user.username };
    this.idToSocketMap.set(user.id, client);
    await this.socketJoin(client, `user_${user.id}`);
    await this.socketJoin(client, 'game_online');
    if (this.pongService.onlineGames) {
      const gameId = this.playersMap.get(user.id);
      if (gameId) await this.socketJoin(client, `game_${gameId}`);
      const gameWatchId = this.spectatorsMap.get(user.id);
      if (gameWatchId) await this.socketJoin(client, `game_${gameWatchId}`);
    }
    this.emitUpdateAllUsers('toAll', 0);
    this.emitUpdateFriendsOf(user.id);
  }

  /* Disconnect main */
  async handleDisconnect(client: Socket): Promise<void> {
    const user = await this.userService.findOneById(client.data.id);
    if (!user) return;
    this.emitUpdateAllUsers('toAll', 0);
    this.emitUpdateFriendsOf(user.id);
    this.pongService.removeFromQueue(user.id);
    this.idToSocketMap.delete(user.id);
  }

  /* Game queue matching + game creation + redirection to play */
  @SubscribeMessage('joinGameQueue')
  async joinQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameDto: GameDto): Promise<boolean> {
    const access_token = extractAccessTokenFromCookie(client);
    if (!client.data.id || !access_token) {
      client.emit('gameError', { errorStatus: '401' });
      return;
    }
    const user = await this.authService.validateJwtToken(access_token, true);
    if (!user) return;
    const gameId = this.playersMap.get(user.id);
    if (gameId !== undefined) // user is in a game
      return this.server.to(`user_${user.id}`).emit(`joinGameQueue`, { status: 'INGAME', gameMode: 0 });
    const gameQueue = this.pongService.addToQueue(user, gameDto);
    if (gameQueue != null) { // try to match player + create game if match
      this.server.to(`user_${user.id}`).emit(`joinGameQueue`, { status: 'JOINED', gameMode: gameDto.gameMode });
      const gameData = await this.pongService.gameCreate(gameDto, this.server);
      if (!gameData) return;
      let gameMode = parseInt(gameDto.gameMode);
      const game = new GameStruct(
        gameMode,
        gameData.gameId,
        gameData.player1Id,
        gameData.player2Id,
        gameData.gameChannel,
      );
      this.pongService.onlineGames.set(game.prop.id, game);
      const player1 = await this.userService.findOneById(game.pl1.id);
      const player2 = await this.userService.findOneById(game.pl2.id);
      const player1socket = this.idToSocketMap.get(game.pl1.id);
      const player2socket = this.idToSocketMap.get(game.pl2.id);
      if (player1socket === undefined || player2socket === undefined) {
        this.pongService.deleteGamePrismaAndList(game.prop.id);
        return;
      }
      await this.socketJoin(player1socket, `game_${game.prop.id}`);
      await this.socketJoin(player2socket, `game_${game.prop.id}`);
      this.playersMap.delete(player1.id);
      this.playersMap.delete(player2.id);
      this.playersMap.set(player1.id, game.prop.id);
      this.playersMap.set(player2.id, game.prop.id);
      const data = {
        status: 'START',
        gameChannel: game.prop.room,
        game: gameData,
        player1: player1,
        player2: player2,
      };
      // this.printUsersInRoom(`game_${game.prop.id}`);
      this.server.to(`user_${game.pl1.id}`).emit(`joinGameQueue`, data);
      this.server.to(`user_${game.pl2.id}`).emit(`joinGameQueue`, data);
      this.updateEmitOnlineGames('toRoom', 0);
      this.emitUpdateAllUsers('toAll', 0);
      this.emitUpdateFriendsOf(player1.id);
      this.emitUpdateFriendsOf(player2.id);
    }
  }

  /* Leave game queue */
  @SubscribeMessage('leaveGameQueue')
  async leaveQueue(
    @ConnectedSocket() client: Socket): Promise<void> {
    const access_token = extractAccessTokenFromCookie(client);
    if (!client.data.id || !access_token) return;
    const user = await this.authService.validateJwtToken(access_token, true);
    if (!user) return;
    this.server.to(`user_${user.id}`).emit(`joinGameQueue`, { status: 'LEAVE', gameMode: 0 });
    this.pongService.removeFromQueue(user.id);
  }

  async setupNewGameEmitUpdate(game: GameStruct, gameData: any): Promise<void> {
    const player1 = await this.userService.findOneById(game.pl1.id);
    const player2 = await this.userService.findOneById(game.pl2.id);
    const player1socket = this.idToSocketMap.get(game.pl1.id);
    const player2socket = this.idToSocketMap.get(game.pl2.id);
    if (player1socket === undefined || player2socket === undefined)
      return this.pongService.deleteGamePrismaAndList(game.prop.id)
    await this.socketJoin(player1socket, `game_${game.prop.id}`);
    await this.socketJoin(player2socket, `game_${game.prop.id}`);
    this.playersMap.delete(player1.id);
    this.playersMap.delete(player2.id);
    this.playersMap.set(player1.id, game.prop.id);
    this.playersMap.set(player2.id, game.prop.id);
    const data = { status: 'START', gameChannel: game.prop.room, game: gameData, player1: player1, player2: player2 };
    this.server.to(`user_${game.pl1.id}`).emit(`joinGameQueue`, data);
    this.server.to(`user_${game.pl2.id}`).emit(`joinGameQueue`, data);
    this.updateEmitOnlineGames('toRoom', 0);
    this.emitUpdateAllUsers('toAll', 0);
    this.emitUpdateFriendsOf(player1.id);
    this.emitUpdateFriendsOf(player2.id);
  }

  async startDual(dualDto: DualDto): Promise<void> {
    try {
      const gameData = await this.pongService.dualCreate(dualDto);
      const game = new GameStruct(
        1,
        gameData.gameId,
        gameData.player1Id,
        gameData.player2Id,
        gameData.gameChannel,
      );
      this.pongService.onlineGames.set(game.prop.id, game); // mettre game sur onlinegames
      const player1 = await this.userService.findOneById(game.pl1.id);
      const player2 = await this.userService.findOneById(game.pl2.id);
      const player1socket = this.idToSocketMap.get(game.pl1.id);
      const player2socket = this.idToSocketMap.get(game.pl2.id);
      if (player1socket === undefined || player2socket === undefined) {
        await this.pongService.deleteGamePrismaAndList(game.prop.id);
        return;
      }
      await this.socketJoin(player1socket, `game_${game.prop.id}`); // join la game room
      await this.socketJoin(player2socket, `game_${game.prop.id}`);
      this.playersMap.delete(player1.id); // secure si une game deja en cours
      this.playersMap.delete(player2.id);
      this.playersMap.set(player1.id, game.prop.id); // playerMapGet renvoie si le joueur isplaying
      this.playersMap.set(player2.id, game.prop.id);
      const data = {
        message: 'yes',
        gameChannel: game.prop.room,
        game: gameData,
        player1: player1,
        player2: player2,
      };
      // this.server.to(`user_${game.pl1.id}`).emit(`joinGameQueue`, data);
      // this.server.to(`user_${game.pl2.id}`).emit(`joinGameQueue`, data);
      dualDto.socketPlayer1.emit('answerInvitation', data);
      dualDto.socketPlayer2.emit('answerInvitation', data);
      await this.updateEmitOnlineGames('toRoom', 0);
      await this.emitUpdateAllUsers('toAll', 0);
      await this.emitUpdateFriendsOf(player1.id);
      await this.emitUpdateFriendsOf(player2.id);
    } catch (error) {
    }
  }

  /* Prepare to play + game start */
  @SubscribeMessage('prepareToPlay')
  async handlePlayerReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { player: string, action: string }): Promise<any> {

    const access_token = extractAccessTokenFromCookie(client);
    if (!client.data.id || !access_token) return;
    const user = await this.authService.validateJwtToken(access_token, true);
    if (!user) return;
    const gameId = this.playersMap.get(user.id);
    const gameStruct = this.pongService.getGameStructById(gameId);
    if (!gameId || !gameStruct) {
      if (gameId && !gameStruct)
        this.playersMapDeleteGameById(gameId);
      return this.server.to(`user_${user.id}`).emit('noGame', { status: 'noGame' });
    }
    let player: Player;
    let opponent: Player;
    const playerNum = await this.pongService.getPlayerById(
      gameStruct.prop.id,
      user.id,
    );
    if (playerNum === 1) {
      player = gameStruct.pl1;
      opponent = gameStruct.pl2;
    } else if (playerNum === 2) {
      player = gameStruct.pl2;
      opponent = gameStruct.pl1;
    }
    // Status - triggered on each refresh until of Play component
    if (data.action === 'status')
      return this.sendUpdateToPlayer(gameStruct, player, opponent.status, gameStruct.prop.countdown, 'prepareToPlay');
    // Wait for opponent and deal with timeout
    else if (data.action === 'playPressed' && opponent.status === 'pending') {
      player.status = 'ready';
      gameStruct.prop.status = 'waiting';
      this.sendUpdateToPlayer(
        gameStruct,
        player,
        opponent.status,
        -1,
        'prepareToPlay',
      );
      const timeoutInSeconds = 10;
      await new Promise((resolve) => setTimeout(resolve, timeoutInSeconds * 1000));
      this.deleteGameIfNoInterraction(gameStruct, player, opponent);
    }
    // Both ready launch game
    else if (data.action === 'playPressed' && opponent.status === 'ready')
      this.readyLaunchGame(gameStruct, player, opponent);
  }

  async deleteGameIfNoInterraction(game: GameStruct, player: Player, opponent: Player): Promise<void> {
    if (opponent.status === 'pending'
      && game.prop.status === 'waiting') {
      game.prop.status = 'timeout';
      game.sendUpdateToRoom(player.id, player.status,
        opponent.id, opponent.status, -1, 'prepareToPlay');
      await this.pongService.deleteGamePrismaAndList(game.prop.id);
      this.playersMap.delete(player.id);
      this.playersMap.delete(opponent.id);
      this.removeSpectatorsFromList(game.prop.id);
      this.updateEmitOnlineGames('toRoom', 0);
      this.emitUpdateAllUsers('toAll', 0);
      this.emitUpdateFriendsOf(game.pl1.id);
      this.emitUpdateFriendsOf(game.pl2.id);
    }
  }

  async readyLaunchGame(game: GameStruct, player: Player, opponent: Player): Promise<void> {
    player.status = 'ready';
    game.sendUpdateToRoom(player.id, player.status,
      opponent.id, opponent.status, game.prop.countdown, 'prepareToPlay');
    await this.launchCountdown(game);
    if (game.prop.status === 'giveUp') return;
    game.prop.status = 'playing';
    game.prop.tStart = Date.now();
    game.sendUpdateToRoom(player.id, player.status,
      opponent.id, opponent.status, -1, 'prepareToPlay');
    game.sendUpdateToRoom(player.id, player.status,
      opponent.id, opponent.status, -1, 'refreshGame');
    await game.startGameLoop();
  }

  async launchCountdown(gameStruct: GameStruct): Promise<void> {
    gameStruct.prop.status = 'countdown';
    gameStruct.pl1.status = 'playing';
    gameStruct.pl2.status = 'playing';
    for (let i = 3; i >= 0; i--) {
      gameStruct.prop.countdown = i;
      if (gameStruct.prop.status !== 'giveUp')
        gameStruct.sendUpdateToRoom(
          gameStruct.pl1.id,
          gameStruct.pl1.status,
          gameStruct.pl2.id,
          gameStruct.pl2.status,
          gameStruct.prop.countdown,
          'prepareToPlay',
        );
      else return;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  /* Prepare to play + game start */
  @SubscribeMessage('onlineGames')
  async getOnlineGames(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { action: string, gameId: string }): Promise<void> {
    const access_token = extractAccessTokenFromCookie(client);
    if (!client.data.id || !access_token) return;
    const user = await this.authService.validateJwtToken(access_token, true);
    if (!user) return;
    this.updateEmitOnlineGames('toUser', user.id);
    const clientSocket = this.idToSocketMap.get(client.data.id);
    if (clientSocket)
      await this.socketJoin(clientSocket, 'onlineGames');
  }

  /* Game commands */
  @SubscribeMessage('moveUp')
  async moveUp(@ConnectedSocket() client: Socket): Promise<void> {
    if (!client.data.id) return;
    const gameId = this.playersMap.get(client.data.id);
    const game = this.pongService.getGameStructById(gameId);
    if (game === undefined || game === null) return;
    if (game.prop.status === 'playing') {
      let player: Player;
      if (client.data.id === game.pl1.id) player = game.pl1;
      else if (client.data.id === game.pl2.id) player = game.pl2;
      if (player === undefined) return;
      game.movePlayerUp(player);
    }
  }

  @SubscribeMessage('unpressUp')
  async stopMoveUp(@ConnectedSocket() client: Socket): Promise<void> {
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
    }
  }

  @SubscribeMessage('moveDown')
  async moveDown(@ConnectedSocket() client: Socket): Promise<void> {
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
    }
  }

  @SubscribeMessage('unpressDown')
  async stopMoveDown(@ConnectedSocket() client: Socket): Promise<void> {
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
    }
  }

  /* Give up function */
  @SubscribeMessage('giveUp')
  async giveUpGame(@ConnectedSocket() client: Socket,
    @MessageBody() data: { player: string, action: string }): Promise<boolean> {
    const access_token = extractAccessTokenFromCookie(client);
    if (!client.data.id || !access_token) return;
    if (data.action !== 'giveUp') return;
    const user = await this.authService.validateJwtToken(access_token, true);
    const gameId = this.playersMap.get(user.id);
    const gameStruct = this.pongService.getGameStructById(gameId);
    if (!gameId || !gameStruct)
      return this.server.to(`user_${client.data.id}`).emit('noGame', { status: 'noGame' });
    let player: Player;
    let opponent: Player;
    const playerNum = await this.pongService.getPlayerById(
      gameStruct.prop.id,
      user.id,
    ); // error handling
    if (playerNum === 1) {
      player = gameStruct.pl1;
      opponent = gameStruct.pl2;
    } else if (playerNum === 2) {
      player = gameStruct.pl2;
      opponent = gameStruct.pl1;
    } else return;
    if (gameStruct.prop.status !== 'ended') {
      gameStruct.stopGameLoop();
      gameStruct.prop.status = 'giveUp';
      player.status = 'givenUp';
      await this.pongService.giveUpGame(gameStruct, opponent, player, true);
      this.playersMap.delete(player.id);
      this.playersMap.delete(opponent.id);
      this.removeSpectatorsFromList(gameStruct.prop.id);
      gameStruct.sendUpdateToRoom(
        player.id,
        player.status,
        opponent.id,
        opponent.status,
        -1,
        'refreshGame',
      );
      gameStruct.sendUpdateToRoom(
        player.id,
        player.status,
        opponent.id,
        opponent.status,
        -1,
        'prepareToPlay',
      );
      this.updateEmitOnlineGames('toRoom', 0);
      this.emitUpdateAllUsers('toAll', 0);
      this.emitUpdateFriendsOf(player.id);
      this.emitUpdateFriendsOf(opponent.id);
      this.emitUpdateProfileHeader(player.id);
      this.emitUpdateProfileHeader(opponent.id);
    }
  }

  /* Refresh front functions */

  eventRemovePlayersFromList(data: any) {
    if (data.pl1Id && data.pl2Id) {
      const pl1Id = parseInt(data.pl1Id);
      const pl2Id = parseInt(data.pl2Id);
      this.playersMap.delete(pl1Id);
      this.playersMap.delete(pl2Id);
    }
  }

  async sendUpdateToRoom(data: any): Promise<void> {
    this.server.to(`user_${data.playerId}`).emit(data.channel,
      {
        gameStatus: data.gameStatus,
        gameParams: data.gameParams,
        playerStatus: data.playerStatus,
        opponentStatus: data.opponentStatus,
        time: Date.now(),
        countdown: data.countdown,
      });
    this.server.to(`user_${data.opponentId}`).emit(data.channel,
      {
        gameStatus: data.gameStatus,
        gameParams: data.gameParams,
        playerStatus: data.playerStatus,
        opponentStatus: data.opponentStatus,
        time: Date.now(),
        countdown: data.countdown,
      });
    const users = await this.server.in(data.room).fetchSockets();
    users.forEach((user) => {
      if (user.id !== data.playerId && user.id !== data.opponentId) {
        user.emit(data.channel, {
          gameStatus: data.gameStatus,
          gameParams: data.gameParams,
          playerStatus: data.playerStatus,
          opponentStatus: data.opponentStatus,
          time: Date.now(),
          countdown: data.countdown,
        });
      }
    });
  }

  sendUpdateToPlayer(
    game: GameStruct,
    player: Player,
    opponentStatus: string,
    countdown: number,
    channel: string) {
    let countdownStr: string | number = countdown === 0 ? 'GO' : countdown;
    this.server.to(`user_${player.id}`).emit(channel,
      {
        gameStatus: game.prop.status,
        gameParams: game.getState(),
        playerStatus: player.status,
        opponentStatus: opponentStatus,
        time: Date.now(),
        countdown: countdownStr,
      });
    return true;
  }

  /* Refresh the front state */
  @Interval(500) // 
  refreshAllGames() {
    this.pongService.onlineGames.forEach((game, key) => {
      game.sendUpdateToRoomInterval();
    })
  }

  /* Clean unactive games */
  @Interval(5000) // every 5 seconds
  cleanTimedOutOnlineGames() {
    let tMax = 10; // in seconds 
    this.pongService.onlineGames.forEach((value, key) => {
      if (Date.now() - value.tStart >= tMax && value.prop.status === 'pending')
        this.dealWithTimeout(value);
    }
    );
  }

  async dealWithTimeout(game: GameStruct): Promise<void> {
    const timeoutInSeconds = 10;
    await new Promise((resolve) => setTimeout(resolve, timeoutInSeconds * 1000));
    if (game.prop.status === 'pending') {
      game.prop.status = 'timeout';
      game.sendUpdateToRoom(game.pl1.id, game.pl1.status, game.pl2.id, game.pl2.status, -1, 'prepareToPlay');
      await this.pongService.deleteGamePrismaAndList(game.prop.id);
      this.playersMap.delete(game.pl1.id);
      this.playersMap.delete(game.pl2.id);
      this.removeSpectatorsFromList(game.prop.id);
      this.updateEmitOnlineGames('toRoom', 0);
      this.emitUpdateAllUsers('toAll', 0);
      this.emitUpdateFriendsOf(game.pl1.id);
      this.emitUpdateFriendsOf(game.pl2.id);
    }
  }

  /* Spectate mode */
  @SubscribeMessage('watchGame')
  async watchGame(@ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string }): Promise<boolean> {
    const access_token = extractAccessTokenFromCookie(client);
    if ((!client.data.id || !access_token))
      return this.server.to(`user_${client.data.id}`).emit('noGame', { status: 'noGame' });
    const user = await this.authService.validateJwtToken(access_token, true);
    const gameId = parseInt(data.gameId);
    const game = gameId === -1 ?
      this.pongService.getGameStructById(this.spectatorsMap.get(user.id)) :
      this.pongService.getGameStructById(gameId);
    const isUserInGame = this.playersMap.get(user.id);
    if (isUserInGame !== undefined) {
      return this.server.to(`user_${client.data.id}`).emit('inGame', { status: 'inGame' });
    } else if (!game)
      return this.server.to(`user_${client.data.id}`).emit('noGame', { status: 'noGame' });
    const clientSocket = this.idToSocketMap.get(user.id);
    if (!clientSocket) return
    const player1 = await this.userService.findOneById(game.pl1.id);
    const player2 = await this.userService.findOneById(game.pl2.id);
    if (gameId !== -1) this.spectatorsMap.set(user.id, gameId);
    await this.socketJoin(clientSocket, `game_${game.prop.id}`);
    const dataToSend = { status: 'OK', gameState: game.getState(), player1: player1, player2: player2 }
    this.server.to(`user_${client.data.id}`).emit('watchGame', dataToSend);
  }

  /* Right screen updater functions */
  /* Friends */
  @SubscribeMessage('friends')
  async friendsHandler(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { action: string }): Promise<void> {
    const access_token = extractAccessTokenFromCookie(client);
    if (!client.data.id || !access_token) return;
    const userId = parseInt(client.data.id);
    this.emitUpdateFriends('toUser', userId);
  }

  async emitUpdateFriends(type: string, userId: number): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    try {
      const userWithFriends = await this.pongService.prismaService.user.findUnique({
        where: { id: userId },
        include: { friends: true },
      });
      if (!userWithFriends) return;
      delete userWithFriends.hash;
      userWithFriends.friends.forEach((user) => {
        delete user.hash;
        const isPlaying = this.playersMap.get(user.id);
        user.isPlaying = isPlaying !== undefined ? true : false;
        const isOnline = isPlaying ? true : this.idToSocketMap.get(user.id);
        user.isOnline = isOnline !== undefined ? true : false;
      });
      if (type === 'toUser')
        return this.server.to(`user_${userId}`).emit('friends', userWithFriends);
      this.server.to('game_online').emit('friends', userWithFriends);
    } catch (error) { handlePrismaError(error); }
  }

  async emitUpdateFriendsOf(userId: number): Promise<void> {
    try {
      const userWithFriends = await this.pongService.prismaService.user.findUnique({
        where: { id: userId },
        include: { friendsOf: true },
      });
      for (const user of userWithFriends.friendsOf.values()) {
        this.emitUpdateFriends('toUser', user.id);
      }
    } catch (error) { handlePrismaError(error); }
  }

  /* All users */
  @SubscribeMessage('allUsers')
  async allUsersHandler(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { action: string }): Promise<void> {
    const access_token = extractAccessTokenFromCookie(client);
    if (!client.data.id || !access_token) return;
    const userId = parseInt(client.data.id);
    this.emitUpdateAllUsers('toUser', userId);
  }

  async emitUpdateAllUsers(type: string, userId: number): Promise<boolean> {
    try {
      const allUsers = await this.pongService.prismaService.user.findMany({
        orderBy: {
          username: 'asc',
        }
      });
      allUsers.forEach((user) => {
        delete user.hash;
        const isPlaying = this.playersMap.get(user.id);
        user.isPlaying = isPlaying !== undefined ? true : false;
        const isOnline = isPlaying ? true : this.idToSocketMap.get(user.id);
        user.isOnline = isOnline !== undefined ? true : false;
      });
      let data: any = {};
      data.allUsers = allUsers;
      data.userId = userId;
      if (type === 'toUser')
        return this.server.to(`user_${userId}`).emit('allUsers', data);
      this.server.to('game_online').emit('allUsers', data);
    } catch (error) { handlePrismaError(error); }
  }

  /* Leaderboard */
  @SubscribeMessage('leaderboard')
  async leaderboardHandler(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { action: string }): Promise<void> {
    const access_token = extractAccessTokenFromCookie(client);
    if (!client.data.id || !access_token) return;
    const userId = parseInt(client.data.id);
    this.emitUpdateLeaderboard('toUser', userId);
  }

  async emitUpdateLeaderboard(type: string, userId: number): Promise<boolean> {
    try {
      const leaderboard = await this.pongService.prismaService.user.findMany({
        orderBy: {
          userPoints: 'desc',
        },
      });
      leaderboard.forEach((user) => {
        delete user.hash;
        const isPlaying = this.playersMap.get(user.id);
        user.isPlaying = isPlaying !== undefined ? true : false;
        const isOnline = isPlaying ? true : this.idToSocketMap.get(user.id);
        user.isOnline = isOnline !== undefined ? true : false;
      });
      let data: any = {};
      data.userId = userId;
      data.leaderboard = leaderboard;
      if (type === 'toUser')
        return this.server.to(`user_${userId}`).emit('leaderboard', data);
      this.server.to('game_online').emit('leaderboard', data);
    } catch (error) { handlePrismaError(error); }
  }

  async updateEmitOnlineGames(type: string, userId: number): Promise<void> {
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
  }
  
  /* Main profile header dashboard */
  @SubscribeMessage('userDataSocket')
  async serveUserProfileData(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any): Promise<void> {
    const access_token = extractAccessTokenFromCookie(client);
    if (!access_token) return;
    const user = await this.authService.validateJwtToken(access_token, true);
    if (!user) return;
    this.server.to(`user_${user.id}`).emit(`userDataSocket`, user);
  }

  async emitUpdateProfileHeader(userId: number): Promise<void> {
    try {
      const user = await this.pongService.prismaService.user.findUnique({
        where: {
          id: userId,
        }
      });
      if (!user) return;
      this.server.to(`user_${userId}`).emit(`userDataSocket`, user);
    } catch (error) { handlePrismaError(error); }
  }

  /* Utils */
  async socketJoin(client: Socket, room: string) {
    const sockets = await this.server.in(room).fetchSockets();
    const isInRoom = sockets.some((Socket) => Socket.id === client.id);
    if (!isInRoom) client.join(room);
  }

  removeSpectatorsFromList(gameIdToDelete: number) {
    for (const [userId, gameId] of this.spectatorsMap.entries()) {
      if (gameId === gameIdToDelete) {
        this.spectatorsMap.delete(userId);
      }
    }
  } 

  playersMapDeleteGameById(gameIdToDelete: number) {
    for (const [userId, gameId] of this.playersMap.entries()) {
      if (gameId === gameIdToDelete) {
        this.playersMap.delete(userId);
      }
    }
  }
}
