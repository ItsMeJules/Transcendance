import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { GetUser } from 'src/auth/decorator';
import { GameDto } from './dto/game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { GameStruct } from './game.class';

export type UserQueue = Map<number, string>;
export type OnlineGameMap = Map<number, GameStruct>;

@Injectable()
export class PongService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService) { }
  private connectedSockets: Map<number, Socket> = new Map();
  private maxQueuesize = 1000;
  userQueue: UserQueue = new Map<number, string>();
  onlineGames: OnlineGameMap = new Map<number, GameStruct>;

  async gameStart(gameMode: GameDto, server: Server) {
    let player1Id: number = 0;
    let player2Id: number = 0;
    const gameModeInt = parseInt(gameMode.gameMode, 10);
    this.userQueue.forEach((value, key) => {
      if (!player1Id && value === gameMode.gameMode)
        player1Id = key;
      else if (!player2Id && value === gameMode.gameMode)
        player2Id = key;
    });
    // start game
    if (player1Id && player2Id) {
      // add try and catch + error handling
      const gameData = await this.prismaService.game.create({
        data: {
          gameMode: gameModeInt,
          player1: { connect: { id: player1Id } },
          player2: { connect: { id: player2Id } },
        },
      });
      this.userQueue.delete(player1Id);
      this.userQueue.delete(player2Id);
      const gameChannel = `game_${gameData.id}`;
      const gameStructure = new GameStruct(gameData.id, player1Id, player2Id, gameChannel);
      gameStructure.room = gameChannel;
      this.onlineGames.set(gameData.id, gameStructure);
      const player1 = await this.userService.findOneById(gameData.player1Id);
      const player2 = await this.userService.findOneById(gameData.player2Id);
      const data = { status: 'START', gameChannel: gameChannel, game: gameData, player1: player1, player2: player2 };
      return data;
    }
    return null;
  }

  removeFromQueue(userId: number): void {
    this.userQueue.delete(userId);
  }

  // Get the queue
  getQueue(): UserQueue {
    return this.userQueue;
  }

  getGameStructById(gameId: number) {
    return this.onlineGames.get(gameId);
  }

  getUsersInQueueForGameMode(gameMode: string): number {
    let count = 0;
    for (const mode of this.userQueue.values()) {
      if (mode === gameMode) {
        count++;
      }
    }
    return count;
  }

  // Set a queue limit?
  queueIsFull(): boolean {
    return (this.userQueue.size >= this.maxQueuesize);
  }

  // Add user to the queue
  addToQueue(user: User, gameMode: GameDto): UserQueue {
    // console.log(`User ${user.id} added to queue for game mode ${gameMode.gameMode}`);
    if (this.queueIsFull())
      return null;
    // console.log('______QUEU BEFORE ADD______');
    // this.userQueue.forEach((value, key) => {
    //   console.log(`Qid ${key} and gameMode:${value}`);
    // });
    this.userQueue.set(user.id, gameMode.gameMode);

    // console.log('______QUEU AFTER ADD______');
    // this.userQueue.forEach((value, key) => {
    //   console.log(`Qid ${key} and gameMode:${value}`);
    // });
    return this.userQueue;
  }

  async getPlayerById(gameId: number, userId: number): Promise<number> {
    this.onlineGames.forEach((value, key) => {
      if (value.id === gameId) {
        if (value.player1.id === userId)
          return 1;
        else if (value.player2.id === userId)
          return 2;
      }
    });
    return 0;
  }
}
