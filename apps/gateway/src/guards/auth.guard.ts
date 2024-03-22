import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { verify } from 'jsonwebtoken'
import { Observable } from 'rxjs'
import { ConfigService } from '@nestjs/config'
import { GatewayEnvVariableKeys } from '../shared/app.constants'
import { AuthRequest } from '@freelance-app/interfaces'

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name)

  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const unAuthorizedException = new UnauthorizedException()
    const request: AuthRequest = context.switchToHttp().getRequest()
    const jwtSession = request?.session?.jwt
    if (!jwtSession) throw unAuthorizedException
    try {
      const jwtToken = this.configService.get(GatewayEnvVariableKeys.jwtToken)
      request.currentUser = verify(jwtSession, jwtToken)
    } catch (e) {
      this.logger.log(e)
      throw unAuthorizedException
    }
    return true
  }
}
