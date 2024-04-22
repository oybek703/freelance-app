import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  constructor() {}

  @Get('auth-health')
  getHealth() {
    return 'Auth service is healthy.'
  }
}
