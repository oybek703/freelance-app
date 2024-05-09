import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { Observable } from 'rxjs'
import { AuthRequest, IJwtPayload } from '@freelance-app/interfaces'
import { verify } from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config'
import { GatewayEnvVariableKeys } from '../shared/app.constants'

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name)

  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const unauthorizedException = new UnauthorizedException()
    const request: AuthRequest = context.switchToHttp().getRequest()
    if (!request.session?.jwt) throw UnauthorizedException
    try {
      const jwtToken = this.configService.get(GatewayEnvVariableKeys.jwtToken)
      request.currentUser = verify(request.session?.jwt, jwtToken) as IJwtPayload
    } catch (e) {
      this.logger.error(e)
      throw unauthorizedException
    }
    return true
  }
}
