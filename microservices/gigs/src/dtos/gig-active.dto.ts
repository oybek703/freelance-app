import { Optional } from '@nestjs/common'
import { IsBoolean } from 'class-validator'

export class GigActiveDto {
  @IsBoolean()
  @Optional()
  active: boolean
}
