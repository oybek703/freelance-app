import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from './models/user.model'
import { Op } from 'sequelize'
import { AuthCommonErrors, AuthEnvVariableKeys } from '../shared/app.constants'
import { v4 as uuid } from 'uuid'
import { CloudinaryService } from './cloudinary.service'
import { randomBytes } from 'crypto'
import { firstLetterUppercase, isEmail, lowerCase, NotificationsEmailTemplates } from '@freelance-app/helpers'
import { AuthEmailProducer } from '../producers/auth-email.producer'
import { BuyerUpdateProducer } from '../producers/buyer-update.producer'
import { BuyerUpdate } from '@freelance-app/contracts'
import BuyerUpdatesTypes = BuyerUpdate.BuyerUpdatesTypes
import { sign } from 'jsonwebtoken'
import { IJwtPayload } from '@freelance-app/interfaces'
import { ConfigService } from '@nestjs/config'
import { SignInDto, SignupDto } from '@freelance-app/dtos'
import { compare } from 'bcryptjs'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private readonly cloudinaryService: CloudinaryService,
    private readonly authEmailProducer: AuthEmailProducer,
    private readonly buyerUpdateProducer: BuyerUpdateProducer,
    private readonly configService: ConfigService
  ) {}

  async getCurrentUser(userId: string) {
    const user = this.userModel.findOne({ where: { id: userId } })
    if (!user) throw new ForbiddenException()
    return { user }
  }

  async signUp(dto: SignupDto) {
    const existingUser = await this.getUserByEmailOrUsername(dto.email, dto.username)
    if (existingUser) throw new BadRequestException(AuthCommonErrors.userAlreadyExists)
    const profilePublicId = uuid()
    const uploadResult = await this.cloudinaryService.uploadImage(dto.profilePicture, {
      public_id: profilePublicId,
      overwrite: true,
      invalidate: true,
      resource_type: 'auto'
    })
    if (!uploadResult.public_id) throw new BadRequestException(AuthCommonErrors.fileUploadError)
    const emailVerificationToken = randomBytes(20).toString('hex')
    const newUser = await this.userModel.create({
      username: firstLetterUppercase(dto.username),
      email: lowerCase(dto.email),
      profilePublicId,
      country: dto.country,
      emailVerificationToken,
      emailVerified: false,
      profilePicture: uploadResult?.secure_url
    })
    await this.buyerUpdateProducer.publishBuyerUpdate({
      username: newUser.username,
      country: newUser.country,
      createdAt: newUser.createdAt,
      email: newUser.email,
      profilePicture: newUser.profilePicture,
      type: BuyerUpdatesTypes.auth
    })
    const verificationLink = `${AuthEnvVariableKeys.clientUrl}/confirm_email?token=${emailVerificationToken}`
    await this.authEmailProducer.publishAuthEmail({
      receiverEmail: newUser.email,
      template: NotificationsEmailTemplates.verifyEmail,
      verifyLink: verificationLink
    })
    const jwtToken = await this.signInToken(newUser)
    return { user: newUser, token: jwtToken }
  }

  async signIn(dto: SignInDto) {
    const { username, password } = dto
    const isUsernameEmail = isEmail(username)
    let user: User
    if (isUsernameEmail) user = await this.userModel.findOne({ where: { email: username } })
    else user = await this.userModel.findOne({ where: { username } })
    if (!user) throw new BadRequestException(AuthCommonErrors.invalidCredentials)
    const isValidPassword = await compare(password, user.password)
    if (!isValidPassword) throw new BadRequestException(AuthCommonErrors.invalidCredentials)
    const jwtToken = await this.signInToken(user)
    return { user, token: jwtToken }
  }

  async getUserByEmailOrUsername(email: string, username: string) {
    return this.userModel.findOne({
      where: { [Op.or]: [{ username: firstLetterUppercase(username) }, { email: lowerCase(email) }] }
    })
  }

  async signInToken(user: User) {
    const jwtToken = this.configService.get(AuthEnvVariableKeys.jwtToken)
    const payload: IJwtPayload = { email: user.email, username: user.username, id: user.id }
    return sign(payload, jwtToken)
  }
}
