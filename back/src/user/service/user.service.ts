import { Injectable } from "@nestjs/common";
import { User, Prisma } from '@prisma/client';

import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class UserService {
	constructor(private prismaService : PrismaService) {}

	async createUser(data : Prisma.UserCreateInput): Promise<User> {
		return this.prismaService.user.create({
			data,
		});
	}
}