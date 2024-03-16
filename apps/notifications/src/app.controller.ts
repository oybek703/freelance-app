import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  constructor() {}

  @Get('notifications-health')
  getHealth() {
    return 'Notifications service is healthy.'
  }
}
