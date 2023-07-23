import { Body, Controller, Get, Post } from '@nestjs/common';
import { User as UserModel } from '@prisma/client'
import { UserService } from '../../database/service/user.service';
import { UserDTO } from '../dto/user.dto';
// import { UserGoogleDTO } from './dto/dto.auth.google'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	getUserInfo(): string {
		return "Entrez vos informations:"
	}

	// @Post()
	// async postUserInfo(@Body() userDto: UserGoogleDTO): Promise<UserModel> {
	// 	return this.userService.createUser({username: userDto.name})
	// }
}