import { IsOptional, IsString } from "class-validator"

export class EditBookmarkDto {
    
    @IsOptional()
    @IsString()
    title?: string
 
    @IsString()
    @IsOptional()
    description?: string

    @IsOptional()
    @IsString()
    link?: string
}