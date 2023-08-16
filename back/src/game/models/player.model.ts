import { Paddle } from "./paddle.model";

export class Player {
    public id: number;
    public status = 'pending';
    public paddle: Paddle;

    constructor(id:number) {
        this.id = id
        this.paddle = new Paddle();
    }
}