import { Injectable } from "@nestjs/common";
import { User, Prisma } from '@prisma/client';

import { PrismaService } from "./prisma.service";

@Injectable()
export class UserService {
	constructor(private prismaService : PrismaService) {}

	async createUser(data : Prisma.UserCreateInput): Promise<User> {
		if (!!(await this.isUserNameTaken(data.username)))
			return null;
		return this.prismaService.user.create({ data });
	}

	private async isUserNameTaken(username: string): Promise<User> {
		return this.prismaService.user.findUnique({where: {username}})
	}
}