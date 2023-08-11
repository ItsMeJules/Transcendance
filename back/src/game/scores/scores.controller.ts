import { Controller, Post, Body } from '@nestjs/common';

@Controller('scores')
export class ScoresController {
  @Post()
  saveScore(@Body() scoreData: { player1: number, player2: number}): string {
    console.log(scoreData);
    return 'Score saved';
  }
}
