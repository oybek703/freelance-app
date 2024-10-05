import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { AxiosService } from '../../services/axios.service'
import { BaseURLRoutes, ISellerGig } from '@oybek703/freelance-app-shared'
import { AppService } from '../../services/app.service'
import { AuthGuard } from '../../guards/auth.guard'

@Controller(BaseURLRoutes.apiGatewayBaseURL)
export class GigServiceController {
  constructor(
    private readonly axiosService: AxiosService,
    private readonly appService: AppService
  ) {}

  @UseGuards(AuthGuard)
  @Get('/gigs/:gigId')
  async getGigById(@Param('gigId') gigId: string) {
    const func = async () => {
      const { data } = await this.axiosService.gigsInstance.get<ISellerGig>(`${BaseURLRoutes.gigsBaseURL}/${gigId}`)
      return data
    }
    return this.appService.wrapTryCatch(func, GigServiceController.prototype.getGigById.name)
  }
}
