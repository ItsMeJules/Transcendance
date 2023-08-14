export interface Ball {
    point: Point;
    dir: Vector;
}

export interface PlayerInterface {
    point: Point;
    dir: Vector;
    hp: number;
}

export interface GameState {
    numberPlayer: number;
    players: PlayerInterface[];
    ball: Ball;
}