import { Injectable } from '@nestjs/common'
import axios from 'axios'
import { sign } from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config'
import { GatewayEnvVariableKeys } from '../shared/app.constants'
import { Request } from 'express'
import { GlobalHeaderKeys, MicroserviceNames } from '@oybek703/freelance-app-shared'

type AxiosCreateType = ReturnType<typeof axios.create>

@Injectable()
export class AxiosService {
  public authInstance: AxiosCreateType
  public usersInstance: AxiosCreateType

  constructor(private readonly configService: ConfigService) {
    const authBaseURL = this.configService.get<string>(GatewayEnvVariableKeys.authBaseUrl)
    const usersBaseURL = this.configService.get<string>(GatewayEnvVariableKeys.usersBaseUrl)
    this.authInstance = this.axiosCreateInstance(authBaseURL, MicroserviceNames.auth)
    this.usersInstance = this.axiosCreateInstance(usersBaseURL, MicroserviceNames.users)
  }

  setToken(instance: AxiosCreateType, req: Request) {
    instance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`
    return instance
  }

  private axiosCreateInstance(baseURL: string, microserviceName?: MicroserviceNames): AxiosCreateType {
    const gatewayJwtToken = this.configService.get<string>(GatewayEnvVariableKeys.gatewayJwtToken)
    const requestGatewayToken = sign({ id: microserviceName }, gatewayJwtToken)
    return axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        [GlobalHeaderKeys.gatewayToken]: requestGatewayToken
      },
      withCredentials: true
    })
  }
}
