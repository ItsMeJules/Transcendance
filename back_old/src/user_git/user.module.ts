import { Module } from '@nestjs/common';

import { UserController } from './controller/user.controller';
import { UserService } from '../database/service/user.service';
import { PrismaModule } from 'src/database/prisma.module';
import { PrismaService } from 'src/database/service/prisma.service';

@Module({
	imports: [PrismaModule],
	controllers: [UserController],
	providers: [UserService, PrismaService]
})
export class UserModule {}