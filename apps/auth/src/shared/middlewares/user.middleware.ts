import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { IJwtPayload } from '@freelance-app/interfaces'
import { verify } from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config'
import { AuthEnvVariableKeys } from '../app.constants'

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      const jwtToken = this.configService.get(AuthEnvVariableKeys.jwtToken)
      const token = req.headers.authorization.split(' ')[1]
      req['currentUser'] = verify(token, jwtToken) as IJwtPayload
    }
    next()
  }
}
