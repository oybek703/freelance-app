import { Body, Controller, Get, Logger, Param, Post, Req, UseGuards } from '@nestjs/common'
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResendEmailDto,
  ResetPasswordDto,
  SignInDto,
  SignupDto
} from '@freelance-app/dtos'
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
  @Post(`${BaseURLRoutes.authBaseURL}/forgot-password`)
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.appService.forgotPassword(body)
  }

  @UseGuards(GatewayGuard)
  @Post(`${BaseURLRoutes.authBaseURL}/reset-password/:token`)
  async resetPassword(@Body() body: ResetPasswordDto, @Param('token') token: string) {
    return this.appService.resetPassword(body, token)
  }

  @UseGuards(GatewayGuard)
  @Post(`${BaseURLRoutes.authBaseURL}/change-password`)
  async changePassword(@Req() req: AuthRequest, @Body() body: ChangePasswordDto) {
    return this.appService.changePassword(body, req?.currentUser?.username)
  }

  @UseGuards(GatewayGuard)
  @Get(`${BaseURLRoutes.authBaseURL}/current-user`)
  async currentUser(@Req() req: AuthRequest) {
    return this.appService.getCurrentUser(req?.currentUser?.id)
  }

  @UseGuards(GatewayGuard)
  @Get(`${BaseURLRoutes.authBaseURL}/refresh-token`)
  async refreshToken(@Req() req: AuthRequest) {
    return this.appService.refreshToken(req?.currentUser?.username)
  }

  @UseGuards(GatewayGuard)
  @Post(`${BaseURLRoutes.authBaseURL}/resend-email`)
  async resendEmail(@Body() body: ResendEmailDto) {
    return this.appService.resendEmail(body)
  }
}
