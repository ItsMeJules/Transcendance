import { Injectable } from '@nestjs/common';
import { UserGoogleDTO } from './dto/dto.auth.google'


@Injectable()
export class AuthService {
	validateUser(User : UserGoogleDTO) : Promise<)