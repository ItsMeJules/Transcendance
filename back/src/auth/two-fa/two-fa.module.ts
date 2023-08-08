import { Module } from '@nestjs/common';
import { TwoFaService } from './two-fa.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import JwtTwoFactorGuard from '../guard/jwt.two-fa.guard';
import { JwtTwoFactorStrategy } from '../strategy/jwt.two-fa.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.jwtSecret,
      signOptions: { expiresIn: '1d' }, // ?
    }),
    UserModule,
    PassportModule,
  ],
  exports: [TwoFaService],
  providers: [TwoFaService, JwtTwoFactorGuard, JwtTwoFactorStrategy],
})
export class TwoFaModule {}
