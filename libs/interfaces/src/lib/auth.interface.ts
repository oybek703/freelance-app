import { Request } from 'express'
import { MicroserviceNames } from '@freelance-app/helpers'

export interface IJwtPayload {
  id: string
  email: string
  username: string
}

export interface AuthRequest extends Request {
  currentUser: IJwtPayload
  session: {
    jwt?: string
  }
}

export interface IGatewayPayload {
  id: MicroserviceNames
}
