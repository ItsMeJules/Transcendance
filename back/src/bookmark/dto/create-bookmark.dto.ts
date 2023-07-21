import { IsOptional, IsString } from "class-validator"

export class CreateBookmarkDto {
    
    @IsString()
    title: string
 
    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    link: string
}