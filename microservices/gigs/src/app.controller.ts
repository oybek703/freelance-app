import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  constructor() {}

  @Get('gigs-health')
  getHealth() {
    return { message: 'Gigs service is healthy.' }
  }
}
