import { Board } from "./Board";
import { Paddle } from "./Paddle";

export class Player {
    public status = 'pending';
    public this = false;
    public num: number;
    public pad: Paddle;
  
    constructor(board: Board, number: number) {
      this.num = number;
      this.pad = new Paddle(board);
    }

    updatePlayer(incomingPlayer : Player) {
      this.status = incomingPlayer.status;
      this.pad.updatePad(incomingPlayer.pad);
    }
  }