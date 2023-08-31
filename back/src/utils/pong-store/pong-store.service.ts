import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

export type IdToSocketMap = Map<number, Socket>;
export type SpectatorMap = Map<number, number>; // <userId, gameId
export type PlayersMap = Map<number, number>; // <userId, gameId

@Injectable()
export class PongStoreService {

  public idToSocketMap = new Map<number, Socket>();
  public spectatorsMap = new Map<number, number>;
  public playersMap = new Map<number, number>;

    // setPlayer(userId: number, gameId: number) {
    //     this.playersMap.set(userId, gameId);
    // }

    // removePlayer(userId: number) {
    //     this.playersMap.delete(userId);
    // }

    // isPlaying(userId: number): boolean {
    //     return this.playersMap.has(userId);
    // }

}