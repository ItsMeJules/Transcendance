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

	async isUserNameTaken(username: string): Promise<User> {
		return this.prismaService.user.findUnique({where: {username}})
	}

	async isEmailTaken(email: string): Promise<User> {
		return this.prismaService.user.findUnique({where: {email}})
	}

	async findOrCreateUserGoogle(data: Prisma.UserCreateInput): Promise<User> {
		let user: User = await this.isEmailTaken(data.email);
		if (user) { return user }

		const createdUser = await this.prismaService.user.create({ data });

		return createdUser;
	}

	async findOneById(id: number): Promise<User | null> {
		const user: User | null= await this.prismaService.user.findUnique({ where: { id } });
		return user;
	}
}