import { Body, Controller, Get, HttpStatus, Param, Post, Put, Res, UseGuards } from '@nestjs/common'
import { BaseURLRoutes, GatewayGuard } from '@oybek703/freelance-app-shared'
import { SellerService } from '../services/seller.service'
import { SellerDto } from '../dtos/seller.dto'
import { Response } from 'express'

@Controller(BaseURLRoutes.usersSellerBaseURL)
@UseGuards(GatewayGuard)
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get('id/:sellerId')
  getSellerById(@Param('sellerId') sellerId: string) {
    return this.sellerService.getSellerById(sellerId)
  }

  @Get('username/:username')
  getSellerByUsername(@Param('username') username: string) {
    return this.sellerService.getSellerByUsername(username)
  }

  @Get('random/:size')
  async getRandomSellers(@Param('size') size: number) {
    return this.sellerService.getRandomSellers(size)
  }

  @Post('create')
  async createSeller(@Body() dto: SellerDto, @Res() res: Response) {
    const newSeller = await this.sellerService.createSeller(dto)
    res.status(HttpStatus.CREATED).json({ message: 'Seller created successfully.', seller: newSeller })
  }

  @Put(':sellerId')
  async updateSeller(@Body() dto: SellerDto, @Param('sellerId') sellerId: string) {
    return this.sellerService.updateSeller(dto, sellerId)
  }

  @Put('seed/:count')
  async seedSellers(@Param('count') count: number) {
    return this.sellerService.seedSellers(count)
  }
}
