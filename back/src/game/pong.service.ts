import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { GetUser } from 'src/auth/decorator';
import { GameDto } from './dto/game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { GameStruct } from './game.class';
import { match } from 'assert';
import { PongEvents } from './pong.gateway';

export type UserQueue = Map<number, string>;
export type OnlineGameMap = Map<number, GameStruct>;

@Injectable()
export class PongService {
  private connectedSockets: Map<number, Socket> = new Map();
  private maxQueuesize = 1000;
  public userQueue: UserQueue = new Map<number, string>();
  public onlineGames: OnlineGameMap = new Map<number, GameStruct>;

  constructor(
    private prismaService: PrismaService,
    private userService: UserService) { }

  async gameCreate(gameMode: GameDto, server: Server) {
    let player1Id: number = 0;
    let player2Id: number = 0;
    const gameModeInt = parseInt(gameMode.gameMode, 10);
    this.userQueue.forEach((value, key) => {
      if (!player1Id && value === gameMode.gameMode)
        player1Id = key;
      else if (!player2Id && value === gameMode.gameMode)
        player2Id = key;
    });
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
      // console.log('gamedata id::::', gameData.id);
      return { gameId: gameData.id, player1Id: player1Id, player2Id: player2Id, gameChannel:gameChannel };

      // const gameStructure = new GameStruct(gameData.id, player1Id, player2Id, gameChannel);
      // gameStructure.prop.room = gameChannel;
      // this.onlineGames.set(gameData.id, gameStructure);
      // const player1 = await this.userService.findOneById(gameData.player1Id);
      // const player2 = await this.userService.findOneById(gameData.player2Id);
      // const data = { status: 'START', gameChannel: gameChannel, game: gameData, player1: player1, player2: player2 };
      // return data;


    }
    return null;
  }


  // private startRegularUpdates() {
  //   if (!this.updateIntervalId) {
  //     this.updateIntervalId = setInterval(() => {
  //       this.sendRegularUpdate();
  //     }, this.updateInterval);
  //   }
  // }

  // private sendRegularUpdate() {
  //   this.onlineGames.forEach((value, key) => {
      
  //   });
    //   if (this.ball && this.prop) {
    //       // Construct the update data as needed
    //       const updateData = {
    //           gameStatus: this.prop.status,
    //           gameState: this.getState(),
    //           time: Date.now(),
    //       };

    //       // Emit the update to the game room
    //       this.server.to().emit('refreshGame', updateDat);
    //       this.server.to(gameStruct.prop.room).emit('gameChannel',
    //         { gameStatus: gameStruct.prop.status, gameState: gameStruct.getState(), time: Date.now() });
    //       }
    //   }
  // }







































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
      if (mode === gameMode)
        count++;
    }
    return count;
  }

  // Set a queue limit?
  queueIsFull(): boolean {
    return (this.userQueue.size >= this.maxQueuesize);
  }

  addToQueue(user: User, gameMode: GameDto): UserQueue {
    if (this.queueIsFull())
      return null;
    this.userQueue.set(user.id, gameMode.gameMode);
    return this.userQueue;
  }

  async deleteGame(gameId: number) {
    // Protect prisma delete??
    await this.prismaService.game.delete({
      where: {
        id: gameId,
      },
    });
    this.onlineGames.delete(gameId);
  }

  async getPlayerById(gameId: number, userId: number): Promise<number> {
    let match: number;
    this.onlineGames.forEach((value, key) => {
      if (value.prop.id === gameId) {
        if (value.pl1.id === userId) {
          match = 1;
          return match;
        }
        else if (value.pl2.id === userId) {
          match = 2
          return match;
        }
      }
    });
    return match;
  }
}
