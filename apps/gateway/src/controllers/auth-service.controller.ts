import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Req,
  UseGuards
} from '@nestjs/common'
import { AxiosService } from '../axios.service'
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResendEmailDto,
  ResetPasswordDto,
  SignInDto,
  SignupDto
} from '@freelance-app/dtos'
import { BaseURLRoutes } from '@freelance-app/helpers'
import { Request } from 'express'
import { AuthGuard } from '../guards/auth.guard'
import { AxiosError } from 'axios'

@Controller(BaseURLRoutes.apiGatewayBaseURL)
export class AuthServiceController {
  private readonly logger = new Logger(AuthServiceController.name)

  constructor(private readonly axiosService: AxiosService) {}

  @Post('auth/signup')
  async signUp(@Req() req: Request, @Body() body: SignupDto) {
    return this.wrapTryCatch(async () => {
      const { data } = await this.axiosService.authInstance.post(`${BaseURLRoutes.authBaseURL}/signup`, body)
      req.session = { jwt: data.token }
      return data
    })
  }

  @Post('auth/signin')
  async signIn(@Req() req: Request, @Body() body: SignInDto) {
    return this.wrapTryCatch(async () => {
      const { data } = await this.axiosService.authInstance.post(`${BaseURLRoutes.authBaseURL}/signin`, body)
      req.session = { jwt: data.token }
      return data
    })
  }

  @Post('auth/forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.wrapTryCatch(async () => {
      const { data } = await this.axiosService.authInstance.post(`${BaseURLRoutes.authBaseURL}/forgot-password`, body)
      return data
    })
  }
  @Post('auth/reset-password/:token')
  async resetPassword(@Body() body: ResetPasswordDto, @Param('token') token: string) {
    return this.wrapTryCatch(async () => {
      const { data } = await this.axiosService.authInstance.post(
        `${BaseURLRoutes.authBaseURL}/reset-password/${token}`,
        body
      )
      return data
    })
  }

  @UseGuards(AuthGuard)
  @Get('auth/current-user')
  async currentUser(@Req() req: Request) {
    return this.wrapTryCatch(async () => {
      const authInstance = this.axiosService.setToken(this.axiosService.authInstance, req)
      const { data } = await authInstance.get(`${BaseURLRoutes.authBaseURL}/current-user`)
      return data
    })
  }

  @UseGuards(AuthGuard)
  @Post('auth/resend-email')
  async resendEmail(@Req() req: Request, @Body() body: ResendEmailDto) {
    return this.wrapTryCatch(async () => {
      const authInstance = this.axiosService.setToken(this.axiosService.authInstance, req)
      const { data } = await authInstance.post(`${BaseURLRoutes.authBaseURL}/resend-email`, body)
      return data
    })
  }

  @UseGuards(AuthGuard)
  @Post('auth/change-password')
  async changePassword(@Req() req: Request, @Body() body: ChangePasswordDto) {
    return this.wrapTryCatch(async () => {
      const authInstance = this.axiosService.setToken(this.axiosService.authInstance, req)
      const { data } = await authInstance.post(`${BaseURLRoutes.authBaseURL}/change-password`, body)
      return data
    })
  }

  @UseGuards(AuthGuard)
  @Get('auth/refresh-token')
  async refreshToken(@Req() req: Request) {
    return this.wrapTryCatch(async () => {
      const authInstance = this.axiosService.setToken(this.axiosService.authInstance, req)
      const { data } = await authInstance.get(`${BaseURLRoutes.authBaseURL}/refresh-token`)
      return data
    })
  }

  private async wrapTryCatch(func: () => Promise<unknown>) {
    try {
      return await func()
    } catch (e) {
      this.logger.error(e.response?.data?.message, { method: AuthServiceController.prototype.signUp })
      if (e instanceof AxiosError) {
        const status = e.response?.status
        const message = e.response?.data?.message
        if (status === HttpStatus.BAD_REQUEST) throw new BadRequestException(message)
        if (status === HttpStatus.FORBIDDEN) throw new ForbiddenException(message)
      }
      throw new InternalServerErrorException()
    }
  }
}
