import { Module } from '@nestjs/common';
import { TwoFaService } from './two-fa.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

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
  providers: [TwoFaService],
})
export class TwoFaModule {}
