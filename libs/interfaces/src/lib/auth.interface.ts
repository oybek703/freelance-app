import { Request } from 'express'

export interface IJwtPayload {
  id: string
  iat: number
}

export class AuthRequest extends Request {
  // TODO Type these later
  currentUser: unknown
  session: {
    jwt?: string
  }
}
