import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Observable } from 'rxjs'
import { AuthRequest, IGatewayPayload } from '@freelance-app/interfaces'
import { verify } from 'jsonwebtoken'
import { GlobalHeaderKeys, MicroserviceNames } from '@freelance-app/helpers'
import { UsersEnvVariableKeys } from '../app.constants'

@Injectable()
export class GatewayGuard implements CanActivate {
  private readonly logger = new Logger(GatewayGuard.name)

  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const forbiddenException = new ForbiddenException()
    const request: AuthRequest = context.switchToHttp().getRequest()
    const gatewayToken = request?.headers[GlobalHeaderKeys.gatewayToken]
    if (!gatewayToken) throw forbiddenException
    try {
      const gatewayJwtToken = this.configService.get(UsersEnvVariableKeys.gatewayJwtToken)
      const gatewayPayload = verify(gatewayToken as string, gatewayJwtToken) as IGatewayPayload
      if (!Object.values(MicroserviceNames).includes(gatewayPayload?.id)) throw forbiddenException
    } catch (e) {
      this.logger.log(String(e), { method: GatewayGuard.prototype.canActivate })
      throw forbiddenException
    }
    return true
  }
}
