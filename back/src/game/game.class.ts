import { Board } from './models/board.model';
import { Ball } from './models/ball.model';
import { Point } from './models/point.model';
import { Player } from './models/player.model';
import { GameProperties } from './models/properties.model';
import { CollisionPointsBall } from './models/collisionPoints.model';
import { CollisionPointsPaddle } from './models/collisionPointsPaddle.model';
import { Paddle } from './models/paddle.model';
import { EventEmitter } from 'events';

export const gameEvents = new EventEmitter();

export interface GameParams {
  pl1: Player;
  pl2: Player;
  ball: Ball;
}

export class GameStruct {
  public tStart = Date.now();
  public gameMode: number;
  public prop: GameProperties;
  public board: Board;
  public ball: Ball;
  public pl1: Player;
  public pl2: Player;
  public winner: Player | null;
  public loser: Player | null;
  public firstStep = true;
  public prevFrameTime = 0;
  private readonly frameRate: number = 60; // [1 / ms]
  private readonly frameDuration: number = 1000 / this.frameRate; // [s]
  private gameLoopInterval: NodeJS.Timeout | null = null;

  ////////////////////
  public update = 1;
  // switch to 1 or 2
  // 1: is the timeframe refresh mode -> refreshing the front on every timeframe
  // 2: event refresh mode -> refreshing only when an event occurs : - paddle up/down - collision

  constructor(gameMode: number, id: number, pl1Id: number, pl2Id: number, room: string) {
    this.gameMode = gameMode;
    this.prop = new GameProperties(id, room);
    this.board = new Board();
    this.ball = new Ball(this.board, gameMode);
    this.pl1 = new Player(this.board, gameMode, pl1Id, 1);
    this.pl2 = new Player(this.board, gameMode, pl2Id, 2);
    this.winner = null;
    this.loser = null;
    this.board.updatePointsAndCollisionParameters(this.pl1.pad);
  }

  /* Main time-frame loop function that calls the main updater */
  async startGameLoop() {
    const frameStartTime = Date.now();
    const deltaTime = frameStartTime - this.prevFrameTime;
    if (!this.firstStep)
      this.updateBallAndPaddles(deltaTime);
    this.firstStep = false;
    const remainingTime = Math.max(this.frameDuration - (Date.now() - frameStartTime), 0);
    if (this.prop.status === 'ended') {
      this.sendUpdateToRoom(this.pl1.id, 'playing', this.pl2.id, 'playing', -1, 'refreshGame');
      if (this.winner && this.loser) {
        gameEvents.emit('serviceEndGame', {
          action: 'endGame',
          gameStruct: this,
          winner: this.winner,
          loser: this.loser,
        });
        this.updateOnlineGames();
      }
      return;
    }
    clearTimeout(this.gameLoopInterval!);
    this.gameLoopInterval = setTimeout(() => {
      this.startGameLoop();
    }, remainingTime);
    this.prevFrameTime = frameStartTime;
  }

  /* Main update of paddles through updatePlayers then ball with checkBo */
  private updateBallAndPaddles(deltaTime: number) {
    this.pl1.pad.posPrev = new Point(this.pl1.pad.pos.x, this.pl1.pad.pos.y);
    this.updatePaddles(deltaTime);
    const deltaX = this.ball.speed * this.ball.dir.x * (deltaTime / 1000);
    const deltaY = this.ball.speed * this.ball.dir.y * (deltaTime / 1000);
    const newPos = new Point(this.ball.pos.x + deltaX, this.ball.pos.y + deltaY);
    let ret = this.updateBall(newPos);
    if (ret === -1) return;
    this.ball.pos.x = newPos.x;
    this.ball.pos.y = newPos.y;
  }

  /* Updates paddles and ball functions by checking the future position and potential collisions */
  private updatePaddles(deltaTime: number) {
    // Opti? updater uniquement une fois si paddle 1 et/ou deux bougent
    // Player 1
    if (this.pl1.isMoving && this.pl1.movingDir === 'up') {
      let pad = this.pl1.pad;
      let newPos = new Point(pad.pos.x, pad.pos.y - pad.speed * (deltaTime / 1000));
      if (newPos.y < this.ball.size * 2)
        newPos.y = this.ball.size * 2;
      let padPosPrev = pad.pos;
      pad.pos = newPos;
      if (this.ballAndPaddleUnionUp(newPos, pad)
        && !this.ballAndPaddleUnionUp(padPosPrev, pad)) {
        this.ball.pos.y = newPos.y - this.ball.halfSize;
        this.ball.dir.y = this.ball.dir.y > 0 ? -this.ball.dir.y : this.ball.dir.y;
        if (pad.speed > this.ball.speed)
          this.ball.speed = pad.speed;
        else
          this.ball.accelerateBall(this.gameMode);
      }
      if (this.update === 2) this.sendUpdateToRoom(this.pl1.id, 'playing', this.pl2.id, 'playing', -1, 'refreshGame');
    } else if (this.pl1.isMoving && this.pl1.movingDir === 'down') {
      let pad = this.pl1.pad;
      let newPos = new Point(pad.pos.x, pad.pos.y + pad.speed * (deltaTime / 1000));
      if (newPos.y > this.board.height - pad.height - this.ball.size * 2)
        newPos.y = this.board.height - pad.height - this.ball.size * 2;
      let padPosPrev = pad.pos;
      pad.pos = newPos;
      if (this.ballAndPaddleUnionDown(newPos, pad)
        && !this.ballAndPaddleUnionDown(padPosPrev, pad)) {
        this.ball.pos.y = newPos.y + pad.height + this.ball.halfSize;
        this.ball.dir.y = this.ball.dir.y < 0 ? -this.ball.dir.y : this.ball.dir.y;
        if (pad.speed > this.ball.speed)
          this.ball.speed = pad.speed;
        else
          this.ball.accelerateBall(this.gameMode);
      }
      if (this.update === 2) this.sendUpdateToRoom(this.pl1.id, 'playing', this.pl2.id, 'playing', -1, 'refreshGame');
    }
    // Player 2
    if (this.pl2.isMoving && this.pl2.movingDir === 'up') {
      let pad = this.pl2.pad;
      let newPos = new Point(pad.pos.x, pad.pos.y - pad.speed * (deltaTime / 1000));
      if (newPos.y < this.ball.size * 2)
        newPos.y = this.ball.size * 2;
      let padPosPrev = pad.pos;
      pad.pos = newPos;
      if (this.ballAndPaddleUnionUp(newPos, pad)
        && !this.ballAndPaddleUnionUp(padPosPrev, pad)) {
        this.ball.pos.y = newPos.y - this.ball.halfSize;
        this.ball.dir.y = this.ball.dir.y > 0 ? -this.ball.dir.y : this.ball.dir.y;
        if (pad.speed > this.ball.speed)
          this.ball.speed = pad.speed;
        else
          this.ball.accelerateBall(this.gameMode);
      }
      if (this.update === 2) this.sendUpdateToRoom(this.pl1.id, 'playing', this.pl2.id, 'playing', -1, 'refreshGame');
    } else if (this.pl2.isMoving && this.pl2.movingDir === 'down') {
      let pad = this.pl2.pad;
      let newPos = new Point(pad.pos.x, pad.pos.y + pad.speed * (deltaTime / 1000));
      if (newPos.y > this.board.height - pad.height - this.ball.size * 2)
        newPos.y = this.board.height - pad.height - this.ball.size * 2;
      let padPosPrev = pad.pos;
      pad.pos = newPos;
      if (this.ballAndPaddleUnionDown(newPos, pad)
        && !this.ballAndPaddleUnionDown(padPosPrev, pad)) {
        this.ball.pos.y = newPos.y + pad.height + this.ball.halfSize;
        this.ball.dir.y = this.ball.dir.y < 0 ? -this.ball.dir.y : this.ball.dir.y;
        if (pad.speed > this.ball.speed)
          this.ball.speed = pad.speed;
        else
          this.ball.accelerateBall(this.gameMode);
      }
      if (this.update === 2) this.sendUpdateToRoom(this.pl1.id, 'playing', this.pl2.id, 'playing', -1, 'refreshGame');
    }
    if (this.update === 1) this.sendUpdateToRoom(this.pl1.id, 'playing', this.pl2.id, 'playing', -1, 'refreshGame');
  }

  private updateBall(newPos: Point) {
    // Left score
    if (newPos.x - this.ball.halfSize <= 0 && this.ball.dir.x < 0) {
      this.scorePoint(2);
      return -1;
    }
    // Right score
    else if (newPos.x + this.ball.halfSize >= this.board.width && this.ball.dir.x > 0) {
      this.scorePoint(1);
      return -1;
    }
    // Up and Low Wall collisions
    else if ((newPos.y - this.ball.halfSize <= 0 && this.ball.dir.y < 0)
      || (newPos.y + this.ball.halfSize >= this.board.height && this.ball.dir.y > 0)) {
      this.ball.dir.y *= -1;
      this.ball.accelerateBall(1);
      if (this.update === 2) this.sendUpdateToRoom(this.pl1.id, 'playing', this.pl2.id, 'playing', -1, 'refreshGame');
    }
    // Paddles
    else {
      let player: Player = this.ball.dir.x < 0 ? this.pl1 : this.pl2;
      this.ball.dir.x < 0 ? player.pad.collisionUpdate(1) : player.pad.collisionUpdate(2);
      let colPtSide: Point = this.getCollisionPointSide(player, player.pad.colPtsSide);
      let colPtUp: Point = this.getCollisionPointSide(player, player.pad.colPtsUp);
      let colPtDown: Point = this.getCollisionPointSide(player, player.pad.colPtsDown);
      colPtSide.round();
      // Left
      if (this.ball.dir.x < 0
        && newPos.x - this.ball.halfSize <= colPtSide.x
        && this.ball.pos.x - this.ball.halfSize >= colPtSide.x) {
        if (this.getNewPointAfterCollisionSide(player, newPos, colPtSide) === -1)
          return -1;
      }
      // Right
      if (this.ball.dir.x > 0
        && newPos.x + this.ball.halfSize >= colPtSide.x
        && this.ball.pos.x + this.ball.halfSize <= colPtSide.x) {
        if (this.getNewPointAfterCollisionSide(player, newPos, colPtSide) === -1)
          return -1;
      }
      // Up
      if (this.ball.dir.y > 0
        && newPos.y + this.ball.halfSize >= colPtUp.y
        && this.ball.pos.y + this.ball.halfSize <= colPtUp.y) {
        colPtUp.round();
        if (this.getNewPointAfterCollisionUpDown(player, newPos, colPtUp) === -1)
          return -1;
      }
      // Down
      if (this.ball.dir.y < 0
        && newPos.y - this.ball.halfSize <= colPtDown.y
        && this.ball.pos.y - this.ball.halfSize >= colPtDown.y) {
        colPtDown.round();
        if (this.getNewPointAfterCollisionUpDown(player, newPos, colPtDown) === -1)
          return -1;
      }
    }
    return 1;
  }

  /* Functions to get the new position of the ball after collision */
  private getNewPointAfterCollisionUpDown(player: Player, newPos: Point, colPt: Point) {
    let ballPosY = this.ball.pos.y < player.pad.pos.y ?
      this.ball.pos.y + this.ball.halfSize : this.ball.pos.y - this.ball.halfSize;
    let dPartial = colPt.y - ballPosY;
    let newPosY = this.ball.pos.y < player.pad.pos.y ?
      newPos.y + this.ball.halfSize : newPos.y - this.ball.halfSize;
    let dFull = newPosY - ballPosY;
    let dPartialX = dPartial * this.ball.dir.x / this.ball.dir.y;
    let dFullX = dFull * this.ball.dir.x / this.ball.dir.y;
    let tmpBallPos = new Point(this.ball.pos.x + dPartialX, this.ball.pos.y + dPartial);
    tmpBallPos.round();
    if (!this.isBallInFrontOfPaddleUpDown(player, tmpBallPos)) return 1;
    this.ball.dir.y *= -1;
    let dNorm = Math.sqrt(Math.pow((dFull - dPartial), 2) + Math.pow((dFullX - dPartialX), 2));
    let tmpBall2 = new Point(
      tmpBallPos.x + dNorm * this.ball.dir.x,
      tmpBallPos.y + dNorm * this.ball.dir.y,
    );
    this.ball.pos = tmpBall2;
    this.ball.accelerateBall(this.gameMode);
    if (this.update === 2) this.sendUpdateToRoom(this.pl1.id, 'playing', this.pl2.id, 'playing', -1, 'refreshGame');
    return -1;
  }

  private getNewPointAfterCollisionSide(player: Player, newPos: Point, colPt: Point) {
    let ballPosX = this.ball.dir.x < 0 ? this.ball.pos.x - this.ball.halfSize : this.ball.pos.x + this.ball.halfSize;
    let newPosX = this.ball.dir.x < 0 ? newPos.x - this.ball.halfSize : newPos.x + this.ball.halfSize;
    let dPartial = colPt.x - ballPosX;
    let dFull = newPosX - ballPosX;
    let dPartialY = dPartial * this.ball.dir.y / this.ball.dir.x;
    let dFullY = dFull * this.ball.dir.y / this.ball.dir.x;
    let tmpBallPos = new Point(this.ball.pos.x + dPartial, this.ball.pos.y + dPartialY);
    tmpBallPos.round();
    if (!this.isBallInFrontOfPaddleSide(player, tmpBallPos)) return 1;
    let colPercentage = this.getCollisionPercentage(player, tmpBallPos);
    this.ball.updateDirectionBounce(colPercentage);
    let dNorm = Math.sqrt(Math.pow((dFull - dPartial), 2) + Math.pow((dFullY - dPartialY), 2));
    let tmpBall2 = new Point(
      tmpBallPos.x + dNorm * this.ball.dir.x,
      tmpBallPos.y + dNorm * this.ball.dir.y,
    );
    this.ball.pos = tmpBall2;
    this.ball.accelerateBall(this.gameMode);
    if (this.update === 2) this.sendUpdateToRoom(this.pl1.id, 'playing', this.pl2.id, 'playing', -1, 'refreshGame');
    return -1;
  }

  /* Functions to check if the ball and paddles are overlapping leading to collision */
  private isPointInBall(p: Point) {
    let b = this.ball;
    if (!(p.x > b.getBallPoint(1).x && p.x < b.getBallPoint(2).x))
      return false;
    if (!(p.y > b.getBallPoint(1).y && p.y < b.getBallPoint(4).y))
      return false;
    return true;
  }

  private isPointInNewPaddle(p: Point, pad: Paddle, newPos: Point) {
    if (!(p.x > newPos.x && p.x < newPos.x + pad.width))
      return false;
    if (!(p.y > newPos.y && p.y < newPos.y + pad.height))
      return false;
    return true;
  }

  private ballAndPaddleUnionUp(pos: Point, pad: Paddle) {
    if ((this.isPointInBall(pos)
      || this.isPointInBall(new Point(pos.x + pad.width, pos.y)))
      || (this.isPointInNewPaddle(this.ball.getBallPoint(3), pad, pos)
        || this.isPointInNewPaddle(this.ball.getBallPoint(4), pad, pos)))
      return true;
    return false;
  }

  private ballAndPaddleUnionDown(pos: Point, pad: Paddle) {
    let posDownLeft = new Point(pos.x, pos.y + pad.height);
    if ((this.isPointInBall(posDownLeft)
      || this.isPointInBall(new Point(posDownLeft.x + pad.width, posDownLeft.y)))
      || (this.isPointInNewPaddle(this.ball.getBallPoint(2), pad, pos)
        || this.isPointInNewPaddle(this.ball.getBallPoint(1), pad, pos)))
      return true;
    return false;
  }

  private isBallInFrontOfPaddleUpDown(player: Player, newPos: Point) {
    // Check ball points
    let border = 2;
    if ((newPos.x - this.ball.halfSize >= player.pad.pos.x - border
      && newPos.x - this.ball.halfSize <= player.pad.pos.x + player.pad.width + border))
      return true;
    if ((newPos.x + this.ball.halfSize >= player.pad.pos.x - border
      && newPos.x - this.ball.halfSize <= player.pad.pos.x + player.pad.width + border))
      return true;
    // Check paddle points
    if ((player.pad.pos.x >= newPos.x - this.ball.halfSize - border)
      && (player.pad.pos.x <= newPos.x + this.ball.halfSize + border))
      return true;
    if ((player.pad.pos.x + player.pad.width >= newPos.x - this.ball.halfSize - border)
      && (player.pad.pos.x + player.pad.width <= newPos.x + this.ball.halfSize + border))
      return true;
    return false;
  }

  private isBallInFrontOfPaddleSide(player: Player, newPos: Point) {
    // check ball points
    if ((newPos.y - this.ball.halfSize >= player.pad.pos.y - 2
      && newPos.y - this.ball.halfSize <= player.pad.pos.y + player.pad.height + 2))
      return true;
    if ((newPos.y + this.ball.halfSize >= player.pad.pos.y - 2
      && newPos.y + this.ball.halfSize <= player.pad.pos.y + player.pad.height + 2))
      return true;
    // Check paddle points
    if ((player.pad.pos.y >= newPos.y - this.ball.halfSize - 2)
      && (player.pad.pos.y <= newPos.y + this.ball.halfSize + 2))
      return true;
    if ((player.pad.pos.y + player.pad.height >= newPos.y - this.ball.halfSize - 2)
      && (player.pad.pos.y + player.pad.height <= newPos.y + this.ball.halfSize + 2))
      return true;
    return false;
  }

  /* Function to compute the angle of reflection on paddle collision */
  private getCollisionPercentage(player: Player, ballPos: Point) {
    let padCenterPos = player.pad.pos.y + player.pad.height * 0.5;
    let padFullSize = (player.pad.height + this.ball.size) * 0.5;
    return ((ballPos.y - padCenterPos) / padFullSize);
  }

  /* Function to compute collision point */
  private getCollisionPointSide(player: Player, colPts: CollisionPointsPaddle) {
    let colPt: Point;
    let ballColPts = new CollisionPointsBall(this.ball);
    let determinant = ballColPts.a * colPts.b - ballColPts.b * colPts.a;
    if (determinant === 0) {
      colPt = new Point(1000000, 1000000);
    } else {
      colPt = new Point(
        (colPts.b * ballColPts.c - ballColPts.b * colPts.c) / determinant,
        (ballColPts.a * colPts.c - colPts.a * ballColPts.c) / determinant);
    }
    return colPt;
  }

  /* Function to score a point and end game if max points is reached by a player */
  private scorePoint(winner: number) {
    let maxScore = 11;
    if (winner === 2) {
      this.pl2.score += 1;
      this.ball.randomService(this.board, 2, this.gameMode);
    } else if (winner === 1) {
      this.pl1.score += 1;
      this.ball.randomService(this.board, 1, this.gameMode);
    }
    this.sendUpdateToRoom(this.pl1.id, 'playing', this.pl2.id, 'playing', -1, 'refreshGame');
    this.updateOnlineGames();
    if (this.pl1.score >= maxScore || this.pl2.score >= maxScore) {
      this.winner = this.pl1.score >= maxScore ? this.pl1 : this.pl2;
      this.loser = this.pl1.score >= maxScore ? this.pl2 : this.pl1;
      this.winner.isWinner = true;
      this.stopGameLoop();
      this.prop.status = 'ended';
      gameEvents.emit('gatewayRemovePlayersFromList', {
        pl1Id: this.pl1.id,
        pl2Id: this.pl2.id,
        gameId: this.prop.id,
      });
    }
    if (this.gameMode === 2) {
      this.pl1.pad.resetPaddleTop(this.board);
      this.pl1.pad.randomInitializer(this.board, 1);
      this.pl2.pad.resetPaddleTop(this.board);
      this.pl2.pad.randomInitializer(this.board, 2);
    }
  }

  /* Functions to update the front via the gateway */
  sendUpdateToRoom(playerId: number, playerStatus: string, opponentId: number, opponentStatus: string, countdown: number, channel: string) {
    let countdownStr: string | number = countdown === 0 ? 'GO' : countdown;
    gameEvents.emit('gatewayUpdateRoom', {
      room: this.prop.room,
      channel: channel,
      gameStatus: this.prop.status,
      gameParams: this.getState(),
      playerId: playerId,
      playerStatus: playerStatus,
      opponentId: opponentId,
      opponentStatus: opponentStatus,
      countdown: countdownStr,
    });
  }

  sendUpdateToRoomInterval() {
    gameEvents.emit('gatewayUpdateRoom', {
      room: this.prop.room,
      channel: 'refreshGame',
      gameStatus: this.prop.status,
      gameParams: this.getState(),
      playerId: this.pl1.id,
      playerStatus: this.pl1.status,
      opponentId: this.pl2.id,
      opponentStatus: this.pl2.status,
      countdown: -1,
    });
  }

  updateOnlineGames() {
    gameEvents.emit('gatewayUpdateOnlineGames', { action: 'update' });
  }

  /* Function to get the state of the game */
  getState(): GameParams {
    const state: GameParams = {
      pl1: this.pl1,
      pl2: this.pl2,
      ball: this.ball,
    };
    return state;
  }

  /* Function to stop the game */
  stopGameLoop() {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
    }
  }

  /* Functions to move the players */
  movePlayerUp(player: Player) {
    if (player.isMoving && player.movingDir === 'up') return;
    player.isMoving = true;
    player.movingDir = 'up';
  }

  movePlayerDown(player: Player) {
    if (player.isMoving && player.movingDir === 'down') return;
    player.isMoving = true;
    player.movingDir = 'down';
  }
}