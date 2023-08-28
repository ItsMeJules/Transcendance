import { Board } from "./Board";
import { Paddle } from "./Paddle";

export class Player {
    public status = 'pending';
    public this = false;
    public num: number;
    public pad: Paddle;
    public isWinner = false;
    public score = 0;
  
    constructor(board: Board, number: number) {
      this.num = number;
      this.pad = new Paddle(board, number);
    }

    updatePlayer(board: Board, incomingPlayer : Player) {
      this.status = incomingPlayer.status;
      this.pad.updatePad(board, incomingPlayer.pad);
    }
  }