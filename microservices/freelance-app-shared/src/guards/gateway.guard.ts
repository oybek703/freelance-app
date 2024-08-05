import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Observable } from 'rxjs'
import { verify } from 'jsonwebtoken'
import { AuthRequest, IGatewayPayload } from '../interfaces/auth.interface'
import { GlobalHeaderKeys, MicroserviceNames, TokenEnvKeys } from '../helpers/global.constants'

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
      const gatewayJwtToken = this.configService.get(TokenEnvKeys.gatewayJwtToken)
      const gatewayPayload = verify(gatewayToken as string, gatewayJwtToken) as IGatewayPayload
      if (!Object.values(MicroserviceNames).includes(gatewayPayload?.id)) throw forbiddenException
    } catch (e) {
      this.logger.log(String(e), { method: GatewayGuard.prototype.canActivate })
      throw forbiddenException
    }
    return true
  }
}
