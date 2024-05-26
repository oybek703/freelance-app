import { ProviderKeys } from '../../shared/app.constants'
import { User } from '../models/user.model'
import { Provider } from '@nestjs/common'

export const userProviders: Provider[] = [
  {
    provide: ProviderKeys.USER_REPOSITORY,
    useValue: User
  }
]
