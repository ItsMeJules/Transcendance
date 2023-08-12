import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { GetUser } from 'src/auth/decorator';
import { GameDto } from './dto/game.dto';

export type UserQueue = Map<number, string>;

@Injectable()
export class GameService {
  private connectedSockets: Map<number, Socket> = new Map();
  // private userQueue: Map<number, string> = new Map();
  userQueue: UserQueue = new Map<number, string>();
  private maxQueuesize = 1000;

  // Set a queue limit?
  queueIsFull(): boolean {
    return (this.userQueue.size >= this.maxQueuesize);
  }

  // Add user to the queue
  addToQueue(user: User, gameMode: GameDto): UserQueue {
    // console.log(`User ${user.id} added to queue for game mode ${gameMode.gameMode}`);

    this.userQueue.set(user.id, gameMode.gameMode);
    this.userQueue.forEach((value, key) => {
      console.log(`Qid ${key} and gameMode:${value}`);
    });
    if (!this.queueIsFull())
      return this.userQueue;
    return null;
  }

  // Remove user from the queue
  removeFromQueue(userId: number): void {
    this.userQueue.delete(userId);
    this.userQueue.forEach((value, key) => {
      console.log(`Qid ${key} and gameMode:${value}`);
    });
    // console.log(`User ${user} removed from queue`);
  }

  // Get the queue
  getQueue(): Map<number, string> {
    return this.userQueue;
  }

}
