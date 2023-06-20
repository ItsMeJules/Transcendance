import { Module } from "@nestjs/common";

import { PrismaService } from "./service/prisma.service";
import { UserService } from "./service/user.service";

@Module({
	imports: [],
	controllers: [],
	providers: [PrismaService, UserService]
})
export class PrismaModule{}