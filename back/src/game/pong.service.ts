import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { GameDto } from './dto/game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { GameStruct } from './game.class';
import { Player } from './models/player.model';
import { gameEvents } from './game.class';
import { DualDto } from './dto/dual.dto';
import { EventEmitter } from 'events';

export type UserQueue = Map<number, string>;
export type OnlineGameMap = Map<number, GameStruct>;

export const pongServiceEmitter = new EventEmitter();

@Injectable()
export class PongService {
  private connectedSockets: Map<number, Socket> = new Map();
  private maxQueuesize = 1000;
  public userQueue: UserQueue = new Map<number, string>();
  public onlineGames: OnlineGameMap = new Map<number, GameStruct>();

  constructor(
    public prismaService: PrismaService,
    private userService: UserService,
  ) {
    gameEvents.on('serviceEndGame', (data) => {
      if (data.action === 'endGame')
        this.endGame(data.gameStruct, data.winner, data.loser);
    });
  }

  async gameCreate(gameMode: GameDto, server: Server) {
    let player1Id: number = 0;
    let player2Id: number = 0;
    const gameModeInt = parseInt(gameMode.gameMode, 10);
    if (gameModeInt !== 1 && gameModeInt !== 2) return null;
    this.userQueue.forEach((value, key) => {
      if (!player1Id && value === gameMode.gameMode) player1Id = key;
      else if (!player2Id && value === gameMode.gameMode) player2Id = key;
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
      return {
        gameId: gameData.id,
        player1Id: player1Id,
        player2Id: player2Id,
        gameChannel: gameChannel,
      };
    }
    return null;
  }

  async dualCreate(dualDto: DualDto): Promise<any> {
    const gameData = await this.prismaService.game.create({
      data: {
        gameMode: 1,
        player1: { connect: { id: dualDto.player1Id } },
        player2: { connect: { id: dualDto.player2Id } },
      },
    });
    const gameChannel = `game_${gameData.id}`;
    return {
      message: 'yes',
      gameId: gameData.id,
      player1Id: dualDto.player1Id,
      player2Id: dualDto.player2Id,
      gameChannel: gameChannel,
    };
  }

  removeFromQueue(userId: number): void {
    this.userQueue.delete(userId);
  }

  getQueue(): UserQueue {
    return this.userQueue;
  }

  getGameStructById(gameId: number) {
    return this.onlineGames.get(gameId);
  }

  getUsersInQueueForGameMode(gameMode: string): number {
    let count = 0;
    for (const mode of this.userQueue.values()) {
      if (mode === gameMode) count++;
    }
    return count;
  }

  // Set a queue limit?
  queueIsFull(): boolean {
    return this.userQueue.size >= this.maxQueuesize;
  }

  addToQueue(user: User, gameMode: GameDto): UserQueue {
    if (this.queueIsFull()) return null;
    this.userQueue.set(user.id, gameMode.gameMode);
    return this.userQueue;
  }

  async deleteGamePrismaAndList(gameId: number) {
    // Protect prisma delete??
    this.onlineGames.delete(gameId);
    await this.prismaService.game.delete({
      where: {
        id: gameId,
      },
    });
  }

  async getPlayerById(gameId: number, userId: number): Promise<number> {
    let match: number;
    this.onlineGames.forEach((value, key) => {
      if (value.prop.id === gameId) {
        if (value.pl1.id === userId) {
          match = 1;
          return match;
        } else if (value.pl2.id === userId) {
          match = 2;
          return match;
        }
      }
    });
    return match;
  }

  async giveUpGame(
    gameStruct: GameStruct,
    winner: Player,
    loser: Player,
    giveUp: boolean,
  ) {
    try {
      loser.score = giveUp ? -1 : loser.score;
      const game = await this.prismaService.game.findUnique({
        where: { id: gameStruct.prop.id },
      });
      if (!game) {
        console.log('Game not found'); // set error accordingly
        return;
      }

      await this.prismaService.game.update({
        where: { id: gameStruct.prop.id },
        data: {
          winner: { connect: { id: winner.id } },
          loser: { connect: { id: loser.id } },
          player1Score:
            game.player1Id === winner.id ? winner.score : loser.score,
          player2Score:
            game.player2Id === winner.id ? winner.score : loser.score,
        },
      });
      const winnerPrisma = await this.prismaService.user.findUnique({
        where: { id: winner.id },
      });
      const loserPrisma = await this.prismaService.user.findUnique({
        where: { id: loser.id },
      });
      // Protect if not found
      this.onlineGames.delete(gameStruct.prop.id);
      await this.updatePlayersAfterGame(winnerPrisma, loserPrisma);
      console.log('Game updated successfully');
    } catch (error) {
      console.error('Error updating game:', error);
    }
  }

  async endGame(gameStruct: GameStruct, winner: Player, loser: Player) {
    try {
      console.log('inside game end');
      const game = await this.prismaService.game.findUnique({
        where: { id: gameStruct.prop.id },
      });
      if (!game) {
        console.log('Game not found'); // set error accordingly
        return;
      }
      const winnerPrisma = await this.prismaService.user.findUnique({
        where: { id: winner.id },
      });
      const loserPrisma = await this.prismaService.user.findUnique({
        where: { id: loser.id },
      });
      await this.prismaService.game.update({
        where: { id: gameStruct.prop.id },
        data: {
          winner: { connect: { id: winner.id } },
          loser: { connect: { id: loser.id } },
          player1Score:
            game.player1Id === winner.id ? winner.score : loser.score,
          player2Score:
            game.player2Id === winner.id ? winner.score : loser.score,
        },
      });
      // Protect if not found
      this.onlineGames.delete(gameStruct.prop.id);
      await this.updatePlayersAfterGame(winnerPrisma, loserPrisma);
      console.log('Game updated successfully');
      pongServiceEmitter.emit('serviceEndGame', { action: 'emitOnlineGames' });
      // emit to front room
    } catch (error) {
      console.error('Error updating game:', error);
    }
  }

  async updatePlayersAfterGame(winner: User, loser: User) {
    const winnerLevel = Math.round(winner.userLevel.toNumber());
    const loserLevel = Math.round(loser.userLevel.toNumber());

    // Ladder logic
    const points = Math.round(
      Math.sqrt((11 - winnerLevel) * (1 + loserLevel) + 1),
    );

    let winnerPoints = winner.userPoints + points;
    let loserPoints =
      loser.userPoints - points < 0 ? 0 : loser.userPoints - points;

    const winnerNewLevel =
      winnerLevel >= 10 ? winnerLevel : winnerLevel + winnerPoints * 0.01;
    const loserNewLevel =
      loserLevel >= 10 ? loserLevel : loserLevel + loserPoints * 0.0025;

    const updateWinnerData = {
      gamesPlayed: winner.gamesPlayed + 1,
      gamesWon: winner.gamesWon + 1,
      userPoints: winnerPoints,
      userLevel: winnerNewLevel,
    };

    const updateLoserData = {
      gamesPlayed: loser.gamesPlayed + 1,
      userPoints: loserPoints,
      userLevel: loserNewLevel,
    };

    try {
      await this.prismaService.user.update({
        where: { id: winner.id },
        data: updateWinnerData,
      });

      await this.prismaService.user.update({
        where: { id: loser.id },
        data: updateLoserData,
      });
    } catch (error) {
      console.error('Error updating game:', error);
    }
  }
}
