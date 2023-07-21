import { IsString, IsNotEmpty, IsEmail , IsUrl } from 'class-validator'

export class UserGoogleDTO {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsNotEmpty()
	username: string
	
	@IsString()
	@IsNotEmpty()
	surname: string

	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsString()
	@IsNotEmpty()
	@IsUrl()
	profilePicture: string
}