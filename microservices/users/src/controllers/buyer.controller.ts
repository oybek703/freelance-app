import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common'
import { AuthRequest, BaseURLRoutes, GatewayGuard } from '@oybek703/freelance-app-shared'
import { BuyerService } from '../services/buyer.service'

@Controller(BaseURLRoutes.usersBuyerBaseURL)
@UseGuards(GatewayGuard)
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  @Get('email')
  async getCurrentBuyerByEmail(@Req() req: AuthRequest) {
    const email = req.currentUser.email
    return this.buyerService.getCurrentBuyerByEmail(email)
  }

  @Get('username')
  async getCurrentBuyerByUsername(@Req() req: AuthRequest) {
    const username = req.currentUser.username
    return this.buyerService.getCurrentBuyerByUsername(username)
  }

  @Get(':username')
  async getBuyerByUsername(@Param('username') username: string) {
    return this.buyerService.getBuyerByUsername(username)
  }
}
