import { Body, Controller, Get, Post } from '@nestjs/common';

import { User as UserModel } from '@prisma/client'

import { UserService } from '../../database/service/user.service';
import { UserDTO } from '../dto/user.dto';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	getUserInfo(): string {
		return "Entrez vos informations:"
	}

	@Post()
	async postUserInfo(@Body() userDto: UserDTO): Promise<UserModel> {
		return this.userService.createUser({username: userDto.name})
	}

}