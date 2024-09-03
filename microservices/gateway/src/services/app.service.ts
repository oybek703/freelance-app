import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common'
import { AxiosError } from 'axios'

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name)

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
}
