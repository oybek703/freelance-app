import { Body, Controller, Get, Logger, Post, Req, UseGuards } from '@nestjs/common'
import { SignInDto, SignupDto } from '@freelance-app/dtos'
import { AuthRequest } from '@freelance-app/interfaces'
import { AppService } from './app.service'
import { BaseURLRoutes } from '@freelance-app/helpers'
import { GatewayGuard } from './shared/guards/gateway.guard'

@Controller()
export class AppController {
  private readonly logger = new Logger(AppService.name)

  constructor(private readonly appService: AppService) {}

  @Get('auth-health')
  getHealth() {
    return { message: 'Auth service is healthy.' }
  }

  @UseGuards(GatewayGuard)
  @Post(`${BaseURLRoutes.authBaseURL}/signup`)
  async signUp(@Body() body: SignupDto) {
    return this.appService.signUp(body)
  }

  @UseGuards(GatewayGuard)
  @Post(`${BaseURLRoutes.authBaseURL}/signin`)
  async signIn(@Body() body: SignInDto) {
    return this.appService.signIn(body)
  }

  @UseGuards(GatewayGuard)
  @Get(`${BaseURLRoutes.authBaseURL}/current-user`)
  async currentUser(@Req() req: AuthRequest) {
    return this.appService.getCurrentUser(req?.currentUser?.id)
  }
}
