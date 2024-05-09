import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { CloudinaryService } from './cloudinary.service'
import { AuthEmailProducer } from '../producers/auth-email.producer'
import { BuyerUpdateProducer } from '../producers/buyer-update.producer'

@Module({
  controllers: [UsersController],
  providers: [UsersService, CloudinaryService, AuthEmailProducer, BuyerUpdateProducer]
})
export class UsersModule {}
