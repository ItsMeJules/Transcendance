import { Board } from "./board.model";
import { Paddle } from "./paddle.model";

export class Player {
    public id: number;
    public status = 'pending';
    public pad: Paddle;

    constructor(id:number, board: Board) {
        this.id = id
        this.pad = new Paddle(board);
    }
}