import { Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common'
import { AxiosService } from '../../services/axios.service'
import { BaseURLRoutes } from '@oybek703/freelance-app-shared'
import { AppService } from '../../services/app.service'
import { AuthGuard } from '../../guards/auth.guard'
import { Request } from 'express'

@Controller(BaseURLRoutes.apiGatewayBaseURL)
export class UsersSellerController {
  constructor(
    private readonly axiosService: AxiosService,
    private readonly appService: AppService
  ) {}

  @UseGuards(AuthGuard)
  @Get('seller/id/:sellerId')
  async sellerById(@Req() req: Request, @Param('sellerId') sellerId: string) {
    const func = async () => {
      const usersInstance = this.axiosService.setToken(this.axiosService.usersInstance, req)
      const { data } = await usersInstance.get(`${BaseURLRoutes.usersSellerBaseURL}/id/${sellerId}`)
      return data
    }
    return this.appService.wrapTryCatch(func, UsersSellerController.prototype.sellerById.name)
  }

  @UseGuards(AuthGuard)
  @Get('seller/username/:username')
  async sellerByUsername(@Req() req: Request, @Param('username') username: string) {
    const func = async () => {
      const usersInstance = this.axiosService.setToken(this.axiosService.usersInstance, req)
      const { data } = await usersInstance.get(`${BaseURLRoutes.usersSellerBaseURL}/username/${username}`)
      return data
    }
    return this.appService.wrapTryCatch(func, UsersSellerController.prototype.sellerByUsername.name)
  }

  @UseGuards(AuthGuard)
  @Get('seller/random/:size')
  async randomSellers(@Req() req: Request, @Param('size') size: number) {
    const func = async () => {
      const usersInstance = this.axiosService.setToken(this.axiosService.usersInstance, req)
      const { data } = await usersInstance.get(`${BaseURLRoutes.usersSellerBaseURL}/random/${size}`)
      return data
    }
    return this.appService.wrapTryCatch(func, UsersSellerController.prototype.randomSellers.name)
  }

  @UseGuards(AuthGuard)
  @Get('seller/create')
  async createSeller(@Req() req: Request) {
    const func = async () => {
      const usersInstance = this.axiosService.setToken(this.axiosService.usersInstance, req)
      const { data } = await usersInstance.post(`${BaseURLRoutes.usersSellerBaseURL}/create`, req.body)
      return data
    }
    return this.appService.wrapTryCatch(func, UsersSellerController.prototype.randomSellers.name)
  }

  @UseGuards(AuthGuard)
  @Put('seller/:sellerId')
  async updateSeller(@Req() req: Request, @Param('sellerId') sellerId: string) {
    const func = async () => {
      const usersInstance = this.axiosService.setToken(this.axiosService.usersInstance, req)
      const { data } = await usersInstance.post(`${BaseURLRoutes.usersSellerBaseURL}/${sellerId}`, req.body)
      return data
    }
    return this.appService.wrapTryCatch(func, UsersSellerController.prototype.updateSeller.name)
  }

  @UseGuards(AuthGuard)
  @Put('seller/seed/:count')
  async seedSellers(@Req() req: Request, @Param('count') count: number) {
    const func = async () => {
      const usersInstance = this.axiosService.setToken(this.axiosService.usersInstance, req)
      const { data } = await usersInstance.put(`${BaseURLRoutes.usersSellerBaseURL}/seed/${count}`)
      return data
    }
    return this.appService.wrapTryCatch(func, UsersSellerController.prototype.updateSeller.name)
  }
}
