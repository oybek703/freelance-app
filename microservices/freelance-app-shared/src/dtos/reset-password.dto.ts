import { IsString, Length } from 'class-validator'

export class ResetPasswordDto {
  @IsString()
  @Length(4, 12)
  password: string

  @IsString()
  @Length(4, 12)
  confirmPassword: string
}
