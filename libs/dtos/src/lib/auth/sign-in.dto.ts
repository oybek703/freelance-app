import { IsString, Length } from 'class-validator'

export class SignInDto {
  @IsString()
  @Length(4, 12)
  username: string

  @IsString()
  @Length(4, 12)
  password: string
}
