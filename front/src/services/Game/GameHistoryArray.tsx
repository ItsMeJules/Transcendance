import GameHistory from "./GameHistory";
import { GameHistoryData } from "./GameHistory";

class GameHistoryArray {

  private static instance: GameHistoryArray;
  private gameHistoryArray: Map<number, GameHistory>;

  private constructor() {
    this.gameHistoryArray = new Map();
  }

  static getInstance() {
    if (!GameHistoryArray.instance) {
      GameHistoryArray.instance = new GameHistoryArray();
    }
    return GameHistoryArray.instance;
  }

  addGame(gameHistoryData: GameHistoryData) {
    const gameId = gameHistoryData.id;

    if (gameId && !this.gameHistoryArray.has(gameId)) {
      const newGameHistory = GameHistory.getInstance();
      newGameHistory.setGameHistoryFromResponseData(gameHistoryData);
      this.gameHistoryArray.set(gameId, newGameHistory);
    }

  }


  removeGame(gameId: number) {
    this.gameHistoryArray.delete(gameId);
  }

  getGameById(gameId: number): GameHistory | undefined {
    return this.gameHistoryArray.get(gameId);
  }

  getGames(): GameHistory[] {
    return Array.from(this.gameHistoryArray.values());
  }
}

export default GameHistoryArray;
