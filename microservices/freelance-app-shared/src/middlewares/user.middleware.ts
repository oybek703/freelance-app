import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config'
import { AuthRequest, IJwtPayload } from '../interfaces/auth.interface'
import { TokenEnvKeys } from '../helpers/global.constants'

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: AuthRequest, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      const jwtToken = this.configService.get(TokenEnvKeys.jwtToken)
      const token = req.headers.authorization.split(' ')[1]
      req['currentUser'] = verify(token, jwtToken) as IJwtPayload
    }
    next()
  }
}
