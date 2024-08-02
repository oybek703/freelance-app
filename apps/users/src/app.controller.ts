import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  constructor() {}

  @Get('users-health')
  getHealth() {
    return { message: 'Users service is healthy.' }
  }
}
