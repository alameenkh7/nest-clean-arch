import { IsArray, IsNotEmpty, IsString } from 'class-validator'

export class FIleDTO {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  imageBlob: string

  @IsString()
  @IsNotEmpty()
  mimeType: string

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  tagIds: string[]
}
