import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { GetUser } from 'src/auth/decorator';
import { GameDto } from './dto/game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

export type UserQueue = Map<number, string>;

@Injectable()
export class GameService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService) { }
  private connectedSockets: Map<number, Socket> = new Map();
  userQueue: UserQueue = new Map<number, string>();
  private maxQueuesize = 1000;

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
    if (player1Id && player2Id) {
      this.userQueue.delete(player1Id);
      this.userQueue.delete(player2Id);
      const newGame = await this.prismaService.game.create({
        data: {
          gameMode: gameModeInt,
          player1: { connect: { id: player1Id } },
          player2: { connect: { id: player2Id } },
        },
      });
      const player1 = await this.userService.findOneById(newGame.player1Id);
      const player2 = await this.userService.findOneById(newGame.player2Id);
      const data = {status: 'START', game: newGame, player1: player1, player2: player2};
      

      return data;
    }
    return null;
  }

  // Remove user from the queue
  removeFromQueue(userId: number): void {
    // console.log('____After remove from queue____');
    // console.log('user to remove:', userId);
    this.userQueue.delete(userId);
    // this.userQueue.forEach((value, key) => {
    //   console.log(`Qid ${key} and gameMode:${value}`);
    // });
    // console.log(`User ${user} removed from queue`);
  }

  // Get the queue
  getQueue(): UserQueue {
    return this.userQueue;
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

}
