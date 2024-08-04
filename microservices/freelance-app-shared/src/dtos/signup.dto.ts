import { IsEmail, IsString, Length } from 'class-validator'

export class SignupDto {
  @IsString()
  @Length(4, 12)
  username: string

  @IsEmail()
  email: string

  @IsString()
  @Length(4, 12)
  password: string

  @IsString()
  country: string

  @IsString()
  profilePicture: string
}
