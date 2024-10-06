import { Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common'
import { AxiosService } from '../../services/axios.service'
import { BaseURLRoutes, IGigPaginateProps, IGigSearchOptions } from '@oybek703/freelance-app-shared'
import { AppService } from '../../services/app.service'
import { AuthGuard } from '../../guards/auth.guard'
import { Request } from 'express'

@Controller(BaseURLRoutes.apiGatewayBaseURL)
export class GigServiceController {
  constructor(
    private readonly axiosService: AxiosService,
    private readonly appService: AppService
  ) {}

  @UseGuards(AuthGuard)
  @Get('/gigs/:gigId')
  async gigById(@Param('gigId') gigId: string) {
    const func = async () => {
      const { data } = await this.axiosService.gigsInstance.get(`${BaseURLRoutes.gigsBaseURL}/${gigId}`)
      return data
    }
    return this.appService.wrapTryCatch(func, GigServiceController.prototype.gigById.name)
  }

  @UseGuards(AuthGuard)
  @Get('/gigs/seller/:sellerId')
  async sellerActiveGigs(@Param('sellerId') sellerId: string) {
    const func = async () => {
      const { data } = await this.axiosService.gigsInstance.get(`${BaseURLRoutes.gigsBaseURL}/seller/${sellerId}`)
      return data
    }
    return this.appService.wrapTryCatch(func, GigServiceController.prototype.sellerActiveGigs.name)
  }

  @UseGuards(AuthGuard)
  @Get('/gigs/seller/paused/:sellerId')
  async sellerPausedGigs(@Param('sellerId') sellerId: string) {
    const func = async () => {
      const { data } = await this.axiosService.gigsInstance.get(
        `${BaseURLRoutes.gigsBaseURL}/seller/paused/${sellerId}`
      )
      return data
    }
    return this.appService.wrapTryCatch(func, GigServiceController.prototype.sellerPausedGigs.name)
  }

  @UseGuards(AuthGuard)
  @Post('/gigs/create')
  async createGig(@Req() req: Request) {
    const func = async () => {
      const { data } = await this.axiosService.gigsInstance.post(`${BaseURLRoutes.gigsBaseURL}/create`, req.body)
      return data
    }
    return this.appService.wrapTryCatch(func, GigServiceController.prototype.createGig.name)
  }

  @UseGuards(AuthGuard)
  @Put('/gigs/active/:gigIgd')
  async updateGigActiveProp(@Req() req: Request) {
    const func = async () => {
      const { data } = await this.axiosService.gigsInstance.put(`${BaseURLRoutes.gigsBaseURL}/active/:gigId`, req.body)
      return data
    }
    return this.appService.wrapTryCatch(func, GigServiceController.prototype.updateGigActiveProp.name)
  }

  @UseGuards(AuthGuard)
  @Put('/gigs/:gigIgd')
  async updateGig(@Req() req: Request) {
    const func = async () => {
      const { data } = await this.axiosService.gigsInstance.put(`${BaseURLRoutes.gigsBaseURL}/:gigId`, req.body)
      return data
    }
    return this.appService.wrapTryCatch(func, GigServiceController.prototype.updateGig.name)
  }

  @UseGuards(AuthGuard)
  @Delete('/gigs/:gigIgd/:sellerId')
  async deleteGig(@Param('gigIgd') gigIgd: string, @Param('sellerId') sellerId: string) {
    const func = async () => {
      const { data } = await this.axiosService.gigsInstance.delete(`${BaseURLRoutes.gigsBaseURL}/${gigIgd}/${sellerId}`)
      return data
    }
    return this.appService.wrapTryCatch(func, GigServiceController.prototype.deleteGig.name)
  }

  @UseGuards(AuthGuard)
  @Get('/gigs/search/:from/:size/:type')
  async searchGigs(@Param() params: IGigPaginateProps, @Query() queryParams: IGigSearchOptions) {
    const func = async () => {
      const { from, size, type } = params
      const { data } = await this.axiosService.gigsInstance.get(
        `${BaseURLRoutes.gigsBaseURL}/search/${from}/${size}/${type}`,
        { params: queryParams }
      )
      return data
    }
    return this.appService.wrapTryCatch(func, GigServiceController.prototype.searchGigs.name)
  }

  @UseGuards(AuthGuard)
  @Get('/gigs/category/:username')
  async getGigsByCategory(@Param('username') username: string) {
    const func = async () => {
      const { data } = await this.axiosService.gigsInstance.get(`${BaseURLRoutes.gigsBaseURL}/category/${username}`)
      return data
    }
    return this.appService.wrapTryCatch(func, GigServiceController.prototype.getGigsByCategory.name)
  }

  @UseGuards(AuthGuard)
  @Get('/gigs/top/:username')
  async getTopGigsByCategory(@Param('username') username: string) {
    const func = async () => {
      const { data } = await this.axiosService.gigsInstance.get(`${BaseURLRoutes.gigsBaseURL}/top/${username}`)
      return data
    }
    return this.appService.wrapTryCatch(func, GigServiceController.prototype.getTopGigsByCategory.name)
  }

  @UseGuards(AuthGuard)
  @Get('/gigs/similar/:gigId')
  async gigsMoreLikeThis(@Param('gigId') gigId: string) {
    const func = async () => {
      const { data } = await this.axiosService.gigsInstance.get(`${BaseURLRoutes.gigsBaseURL}/similar/${gigId}`)
      return data
    }
    return this.appService.wrapTryCatch(func, GigServiceController.prototype.gigsMoreLikeThis.name)
  }

  @UseGuards(AuthGuard)
  @Put('/gigs/:count')
  async seedGigs(@Param('count') count: number) {
    const func = async () => {
      const { data } = await this.axiosService.gigsInstance.put(`${BaseURLRoutes.gigsBaseURL}/seed/${count}`)
      return data
    }
    return this.appService.wrapTryCatch(func, GigServiceController.prototype.seedGigs.name)
  }
}
