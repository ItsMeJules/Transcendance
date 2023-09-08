import User, { UserData } from 'services/User/User';

export interface GameHistoryData {
  id: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  gameMode: number | null;
  player1Score: number | null;
  player2Score: number | null;
  player1: UserData | null;
  player2: UserData | null;
  winner: UserData | null;
  loser: UserData | null;
}

class GameHistory {

  public static instance: GameHistory;
  public id: number | null = null;
  public createdAt: Date | null = null;
  public updatedAt: Date | null = null;
  public gameMode: number | null = null;
  public player1Score: number | null = null;
  public player2Score: number | null = null;
  public player1: UserData | null = null;
  public player2: UserData | null = null;
  public winner: UserData | null = null;
  public loser: UserData | null = null;

  static getInstance() {
      if (!GameHistory.instance) {
        GameHistory.instance = new GameHistory();
      }
      return GameHistory.instance;
  }

  setGameHistoryFromResponseData(data: GameHistoryData) {
    this.id = data.id || null;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
    this.gameMode = data.gameMode || null;
    this.player1Score = data.player1Score || null;
    this.player2Score = data.player2Score || null;
    this.player1 = data.player1 || null;
    this.player2 = data.player2 || null;
    this.winner = data.winner || null;
    this.loser = data.loser || null;
  }

  getData(): GameHistoryData | null {
      return ({
        id: this.id,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        gameMode: this.gameMode,
        player1Score: this.player1Score,
        player2Score: this.player2Score,
        player1: this.player1,
        player2: this.player2,
        winner: this.winner,
        loser: this.loser,
      });
  }

  getId(): number | null {
    if (this.id) {
      return this.id;
    } else {
      return null;
    }
  }

  getCreatedAt(): Date | null {
    if (this.createdAt) {
      return this.createdAt;
    } else {
      return null;
    }
  }

  getUpdatedAt(): Date | null {
    if (this.updatedAt) {
      return this.updatedAt;
    } else {
      return null;
    }
  }

  getGameMode(): number | null {
    if (this.gameMode) {
      return this.gameMode;
    } else {
      return null;
    }
  }

  getPlayer1Score(): number | null {
    if (this.player1Score) {
      return this.player1Score;
    } else {
      return null;
    }
  }

  getPlayer2Score(): number | null {
    if (this.player2Score) {
      return this.player2Score;
    } else {
      return null;
    }
  }

  getPlayer1(): UserData | null {
    if (this.player1) {
      return this.player1;
    } else {
      return null;
    }
  }

  getPlayer2(): UserData | null {
    if (this.player2) {
      return this.player2;
    } else {
      return null;
    }
  }

  getWinner(): UserData | null {
    if (this.winner) {
      return this.winner;
    } else {
      return null;
    }
  }

  getLoser(): UserData | null {
    if (this.loser) {
      return this.loser;
    } else {
      return null;
    }
  }
  
}

export default GameHistory;
