import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
  UseGuards
} from '@nestjs/common'
import { AxiosService } from '../axios.service'
import { SignInDto, SignupDto } from '@freelance-app/dtos'
import { BaseURLRoutes } from '@freelance-app/helpers'
import { Request } from 'express'
import { AuthGuard } from '../guards/auth.guard'
import { AxiosError } from 'axios'

@Controller(BaseURLRoutes.apiGatewayBaseURL)
export class ServicesController {
  private readonly logger = new Logger(ServicesController.name)

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

  @UseGuards(AuthGuard)
  @Get('auth/current-user')
  async currentUser(@Req() req: Request) {
    return this.wrapTryCatch(async () => {
      const authInstance = this.axiosService.setToken(this.axiosService.authInstance, req)
      const { data } = await authInstance.get(`${BaseURLRoutes.authBaseURL}/current-user`)
      return data
    })
  }

  private async wrapTryCatch(func: () => Promise<unknown>) {
    try {
      return await func()
    } catch (e) {
      this.logger.error(e.response?.data?.message, { method: ServicesController.prototype.signUp })
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
