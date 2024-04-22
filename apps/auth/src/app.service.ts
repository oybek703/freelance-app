import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHealth() {
    return 'Auth service is healthy.'
  }
}
