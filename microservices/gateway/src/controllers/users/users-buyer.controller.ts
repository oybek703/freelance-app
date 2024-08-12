import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common'
import { AxiosService } from '../../services/axios.service'
import { BaseURLRoutes } from '@oybek703/freelance-app-shared'
import { AppService } from '../../services/app.service'
import { AuthGuard } from '../../guards/auth.guard'
import { Request } from 'express'

@Controller(BaseURLRoutes.apiGatewayBaseURL)
export class UsersBuyerController {
  constructor(
    private readonly axiosService: AxiosService,
    private readonly appService: AppService
  ) {}

  @UseGuards(AuthGuard)
  @Get('buyer/email')
  async currentBuyerByEmail(@Req() req: Request) {
    const func = async () => {
      const usersInstance = this.axiosService.setToken(this.axiosService.usersInstance, req)
      const { data } = await usersInstance.get(`${BaseURLRoutes.usersBuyerBaseURL}/email`)
      return data
    }
    return this.appService.wrapTryCatch(func, UsersBuyerController.prototype.currentBuyerByEmail.name)
  }

  @UseGuards(AuthGuard)
  @Get('buyer/username')
  async currentBuyerByUsername(@Req() req: Request) {
    const func = async () => {
      const usersInstance = this.axiosService.setToken(this.axiosService.usersInstance, req)
      const { data } = await usersInstance.get(`${BaseURLRoutes.usersBuyerBaseURL}/username`)
      return data
    }
    return this.appService.wrapTryCatch(func, UsersBuyerController.prototype.currentBuyerByUsername.name)
  }

  @UseGuards(AuthGuard)
  @Get('buyer/:username')
  async buyerByUsername(@Req() req: Request, @Param('username') username: string) {
    const func = async () => {
      const usersInstance = this.axiosService.setToken(this.axiosService.usersInstance, req)
      const { data } = await usersInstance.get(`${BaseURLRoutes.usersBuyerBaseURL}${username}`)
      return data
    }
    return this.appService.wrapTryCatch(func, UsersBuyerController.prototype.buyerByUsername.name)
  }
}
