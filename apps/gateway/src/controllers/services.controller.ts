import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { AxiosService } from '../axios.service'
import { SignInDto, SignupDto } from '@freelance-app/dtos'
import { BaseURLRoutes } from '@freelance-app/helpers'
import { Request } from 'express'
import { AuthGuard } from '../guards/auth.guard'

@Controller(BaseURLRoutes.apiGatewayBaseURL)
export class ServicesController {
  constructor(private readonly axiosService: AxiosService) {}

  @Post('auth/signup')
  async signUp(@Req() req: Request, @Body() body: SignupDto) {
    const { data } = await this.axiosService.authInstance.post(`${BaseURLRoutes.authBaseURL}/signup`, body)
    req.session = { jwt: data.token }
    return data
  }

  @Post('auth/signin')
  async signIn(@Req() req: Request, @Body() body: SignInDto) {
    const { data } = await this.axiosService.authInstance.post(`${BaseURLRoutes.authBaseURL}/signin`, body)
    req.session = { jwt: data.token }
    return data
  }

  @UseGuards(AuthGuard)
  @Post('auth/signup')
  async currentUser(@Req() req: Request) {
    const authInstance = this.axiosService.setToken(this.axiosService.authInstance, req)
    const { data } = await authInstance.get(`${BaseURLRoutes.authBaseURL}/current-user`)
    return data
  }
}
