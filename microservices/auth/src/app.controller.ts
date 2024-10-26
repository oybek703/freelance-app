import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common'
import { AppService } from './services/app.service'
import { SearchService } from './services/search.service'
import {
  AuthRequest,
  BaseURLRoutes,
  GatewayGuard,
  IGigPaginateProps,
  IGigSearchOptions
} from '@oybek703/freelance-app-shared'
import { SignupDto } from './dtos/signup.dto'
import { SignInDto } from './dtos/sign-in.dto'
import { ForgotPasswordDto } from './dtos/forgot-password.dto'
import { ResetPasswordDto } from './dtos/reset-password.dto'
import { ChangePasswordDto } from './dtos/change-password.dto'
import { ResendEmailDto } from './dtos/resend-email.dto'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly searchService: SearchService
  ) {}

  @Get('auth-health')
  getHealth() {
    return { message: 'Auth service is healthy.' }
  }

  @UseGuards(GatewayGuard)
  @Get(`${BaseURLRoutes.authBaseURL}/search/gig/:from/:size/:type`)
  async searchGigs(@Param() params: IGigPaginateProps, @Query() queryParams: IGigSearchOptions) {
    return this.searchService.searchGigs(params, queryParams)
  }

  @UseGuards(GatewayGuard)
  @Get(`${BaseURLRoutes.authBaseURL}/search/gig/:gigId`)
  async getGigById(@Param('gigId') gigId: string) {
    return this.searchService.getGigById(gigId)
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
