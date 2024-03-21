import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get('notifications-health')
  getHealth() {
    return 'Notifications service is healthy.'
  }
}
