import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common'
import { AxiosError } from 'axios'
import { CachingService } from '../caching/caching.service'
import { SocketService } from './socket.service'
import { SocketServiceEvents } from '../shared/app.constants'

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name)

  constructor(
    private readonly cachingService: CachingService,
    private readonly socketService: SocketService
  ) {}

  async wrapTryCatch(func: () => Promise<unknown>, method: string) {
    try {
      return await func()
    } catch (e) {
      this.logger.error(e.response?.data?.message, { method })
      if (e instanceof AxiosError) {
        const status = e.response?.status
        const message = e.response?.data?.message
        if (status === HttpStatus.BAD_REQUEST) throw new BadRequestException(message)
        if (status === HttpStatus.FORBIDDEN) throw new ForbiddenException(message)
      }
      throw new InternalServerErrorException()
    }
  }

  async getLoggedInUsers() {
    const loggedInUsers = await this.cachingService.getLoggedInUsersFromCache()
    this.socketService.io.emit(SocketServiceEvents.online, loggedInUsers)
    return { message: 'User is online.' }
  }

  async removeLoggedInUserFromCache(username: string) {
    const loggedInUsers = await this.cachingService.removeLoggedInUserFromCache(username)
    this.socketService.io.emit(SocketServiceEvents.online, loggedInUsers)
    return { message: 'User is offline.' }
  }
}
