import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get('notifications-health')
  getHealth() {
    return { message: 'Notifications service is healthy.' }
  }
}
