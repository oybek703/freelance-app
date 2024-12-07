import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { BaseURLRoutes, GatewayGuard, IGigPaginateProps, IGigSearchOptions } from '@oybek703/freelance-app-shared'
import { GigService } from '../services/gig.service'
import { CreateGigDto } from '../dtos/create-gig.dto'
import { GigActiveDto } from '../dtos/gig-active.dto'

@Controller(BaseURLRoutes.gigsBaseURL)
export class GigController {
  constructor(private readonly gigService: GigService) {}

  @UseGuards(GatewayGuard)
  @Get('seller/pause/:sellerId')
  async sellerPausedGigs(@Param('sellerId') sellerId: string) {
    return this.gigService.getSellerPausedGigs(sellerId)
  }

  @UseGuards(GatewayGuard)
  @Get('seller/:sellerId')
  async sellerActiveGigs(@Param('sellerId') sellerId: string) {
    return this.gigService.getSellerActiveGigs(sellerId)
  }

  @UseGuards(GatewayGuard)
  @Get('/:gigId')
  async gigById(@Param('gigId') gigId: string) {
    return this.gigService.getGigById(gigId)
  }

  @UseGuards(GatewayGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async createGig(@Body() dto: CreateGigDto) {
    return this.gigService.createGig(dto)
  }

  @UseGuards(GatewayGuard)
  @Put('/:gigId')
  async updateGig(@Body() dto: CreateGigDto, @Param('gigId') gigId: string) {
    return this.gigService.updateGig(gigId, dto)
  }

  @UseGuards(GatewayGuard)
  @Delete('/:gigId')
  async deleteGig(@Param('gigId') gigId: string, @Param('sellerId') sellerId: string) {
    return this.gigService.deleteGig(gigId, sellerId)
  }

  @UseGuards(GatewayGuard)
  @Put('/active/:gigId')
  async updateGigActiveProp(@Body() dto: GigActiveDto, @Param('gigId') gigId: string) {
    const { active } = dto
    const gigDocument = await this.gigService.getGigById(gigId)
    return this.gigService.updateGigActiveProp(gigId, { ...gigDocument, active })
  }

  @UseGuards(GatewayGuard)
  @Get(`${BaseURLRoutes.gigsBaseURL}/search/:from/:size/:type`)
  async searchGigs(@Param() params: IGigPaginateProps, @Query() queryParams: IGigSearchOptions) {
    return this.gigService.searchGigs(params, queryParams)
  }

  @UseGuards(GatewayGuard)
  @Get(`${BaseURLRoutes.gigsBaseURL}/category/:username`)
  async gigsByCategory(@Param('username') username: string) {
    return this.gigService.getGigsByCategory(username)
  }

  @UseGuards(GatewayGuard)
  @Get(`${BaseURLRoutes.gigsBaseURL}/top/:username`)
  async topGigsByCategory(@Param('username') username: string) {
    return this.gigService.getTopGigsByCategory(username)
  }

  @UseGuards(GatewayGuard)
  @Get(`${BaseURLRoutes.gigsBaseURL}/similar/:gigId`)
  async gigsMoreLikeThis(@Param('gigId') gigId: string) {
    return this.gigService.getGigsMoreLikeThis(gigId)
  }

  @UseGuards(GatewayGuard)
  @Put(`${BaseURLRoutes.gigsBaseURL}/seed/:count`)
  async seedGigs(@Param('count') count: number) {
    return this.gigService.seedGigs(count)
  }
}
