import { Body, Controller, Get, Post } from '@nestjs/common';

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
	postUserInfo(@Body() userDto: UserDTO): string {
		this.userService.createUser({username: userDto.name})
		return "Ce sont les informations que l'user a rentre: " + userDto.name
	}

}