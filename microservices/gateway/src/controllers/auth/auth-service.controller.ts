import { Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common'
import { AxiosService } from '../../services/axios.service'
import { Request } from 'express'
import { AuthGuard } from '../../guards/auth.guard'
import { BaseURLRoutes, IGigPaginateProps, IGigSearchOptions } from '@oybek703/freelance-app-shared'
import { AppService } from '../../services/app.service'

@Controller(BaseURLRoutes.apiGatewayBaseURL)
export class AuthServiceController {
  constructor(
    private readonly axiosService: AxiosService,
    private readonly appService: AppService
  ) {}

  @Get('search/gig/:gigId')
  async getGigById(@Param('gigId') gigId: string) {
    const func = async () => {
      const { data } = await this.axiosService.authInstance.get(`${BaseURLRoutes.authBaseURL}/search/gig/${gigId}`)
      return data
    }
    return this.appService.wrapTryCatch(func, AuthServiceController.prototype.getGigById.name)
  }

  @Get('search/gig/:from/:size/:type')
  async searchGigs(@Param() params: IGigPaginateProps, @Query() queryParams: IGigSearchOptions) {
    const func = async () => {
      const { from, size, type } = params
      const { data } = await this.axiosService.authInstance.get(
        `${BaseURLRoutes.authBaseURL}/search/gig/${from}/${size}/${type}`,
        { params: queryParams }
      )
      return data
    }
    return this.appService.wrapTryCatch(func, AuthServiceController.prototype.searchGigs.name)
  }

  @Post('auth/signup')
  async signUp(@Req() req: Request) {
    const func = async () => {
      const { data } = await this.axiosService.authInstance.post(`${BaseURLRoutes.authBaseURL}/signup`, req.body)
      req.session = { jwt: data.token }
      return data
    }
    return this.appService.wrapTryCatch(func, AuthServiceController.prototype.signUp.name)
  }

  @Post('auth/signin')
  async signIn(@Req() req: Request) {
    const func = async () => {
      const { data } = await this.axiosService.authInstance.post(`${BaseURLRoutes.authBaseURL}/signin`, req.body)
      req.session = { jwt: data.token }
      return data
    }
    return this.appService.wrapTryCatch(func, AuthServiceController.prototype.signIn.name)
  }

  @Post('auth/forgot-password')
  async forgotPassword(@Req() req: Request) {
    const func = async () => {
      const { data } = await this.axiosService.authInstance.post(
        `${BaseURLRoutes.authBaseURL}/forgot-password`,
        req.body
      )
      return data
    }
    return this.appService.wrapTryCatch(func, AuthServiceController.prototype.forgotPassword.name)
  }

  @Post('auth/reset-password/:token')
  async resetPassword(@Req() req: Request, @Param('token') token: string) {
    const func = async () => {
      const { data } = await this.axiosService.authInstance.post(
        `${BaseURLRoutes.authBaseURL}/reset-password/${token}`,
        req.body
      )
      return data
    }
    return this.appService.wrapTryCatch(func, AuthServiceController.prototype.resetPassword.name)
  }

  @UseGuards(AuthGuard)
  @Get('auth/current-user')
  async currentUser(@Req() req: Request) {
    const func = async () => {
      const authInstance = this.axiosService.setToken(this.axiosService.authInstance, req)
      const { data } = await authInstance.get(`${BaseURLRoutes.authBaseURL}/current-user`)
      return data
    }
    return this.appService.wrapTryCatch(func, AuthServiceController.prototype.currentUser.name)
  }

  @UseGuards(AuthGuard)
  @Post('auth/resend-email')
  async resendEmail(@Req() req: Request) {
    const func = async () => {
      const authInstance = this.axiosService.setToken(this.axiosService.authInstance, req)
      const { data } = await authInstance.post(`${BaseURLRoutes.authBaseURL}/resend-email`, req.body)
      return data
    }
    return this.appService.wrapTryCatch(func, AuthServiceController.prototype.resendEmail.name)
  }

  @UseGuards(AuthGuard)
  @Post('auth/change-password')
  async changePassword(@Req() req: Request) {
    const func = async () => {
      const authInstance = this.axiosService.setToken(this.axiosService.authInstance, req)
      const { data } = await authInstance.post(`${BaseURLRoutes.authBaseURL}/change-password`, req.body)
      return data
    }
    return this.appService.wrapTryCatch(func, AuthServiceController.prototype.changePassword.name)
  }

  @UseGuards(AuthGuard)
  @Get('auth/refresh-token')
  async refreshToken(@Req() req: Request) {
    const func = async () => {
      const authInstance = this.axiosService.setToken(this.axiosService.authInstance, req)
      const { data } = await authInstance.get(`${BaseURLRoutes.authBaseURL}/refresh-token`)
      return data
    }
    return this.appService.wrapTryCatch(func, AuthServiceController.prototype.refreshToken.name)
  }

  @UseGuards(AuthGuard)
  @Get('auth/logged-in-user')
  async getLoggedInUsers() {
    return this.appService.getLoggedInUsers()
  }

  @UseGuards(AuthGuard)
  @Delete('auth/logged-in-user/:username')
  async removeLoggedInUserFromCache(@Param('username') username: string) {
    return this.appService.removeLoggedInUserFromCache(username)
  }
}
