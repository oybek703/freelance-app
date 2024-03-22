import { BadGatewayException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { AuthRequest } from '@freelance-app/interfaces'

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: AuthRequest = context.switchToHttp().getRequest()
    if (!request.currentUser) throw new BadGatewayException()
    return true
  }
}
