import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get('gateway-health')
  getHealth() {
    return { message: 'Gateway service is healthy.' }
  }
}
