import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { SignInDto, SignupDto } from '@freelance-app/dtos'
import { UsersService } from './users.service'
import { GatewayGuard } from '../shared/guards/gateway.guard'
import { AuthRequest } from '@freelance-app/interfaces'
import { BaseURLRoutes } from '@freelance-app/helpers'

@Controller(BaseURLRoutes.authBaseURL)
@UseGuards(GatewayGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signUp(@Body() body: SignupDto) {
    return this.usersService.signUp(body)
  }

  @Post('signin')
  async signIn(@Body() body: SignInDto) {
    return this.usersService.signIn(body)
  }

  @Post('current-user')
  async currentUser(@Req() req: AuthRequest) {
    return this.usersService.getCurrentUser(req.currentUser.id)
  }
}
