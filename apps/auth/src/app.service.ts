import { BadRequestException, ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common'
import { User } from './database/models/user.model'
import { CloudinaryService } from './cloudinary.service'
import { AuthEmailProducer } from './producers/auth-email.producer'
import { BuyerUpdateProducer } from './producers/buyer-update.producer'
import { ConfigService } from '@nestjs/config'
import { SignInDto, SignupDto } from '@freelance-app/dtos'
import { AuthCommonErrors, AuthEnvVariableKeys, ProviderKeys } from './shared/app.constants'
import { v4 as uuid } from 'uuid'
import { randomBytes } from 'crypto'
import { firstLetterUppercase, isEmail, lowerCase, NotificationsEmailTemplates } from '@freelance-app/helpers'
import { compare } from 'bcryptjs'
import { Op } from 'sequelize'
import { IJwtPayload } from '@freelance-app/interfaces'
import { sign } from 'jsonwebtoken'
import { BuyerUpdate } from '@freelance-app/contracts'

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name)

  constructor(
    @Inject(ProviderKeys.USER_REPOSITORY) private userRepository: typeof User,
    private readonly cloudinaryService: CloudinaryService,
    private readonly authEmailProducer: AuthEmailProducer,
    private readonly buyerUpdateProducer: BuyerUpdateProducer,
    private readonly configService: ConfigService
  ) {}

  async getCurrentUser(userId: string) {
    if (!userId) throw new ForbiddenException()
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) throw new BadRequestException()
    return { user: { ...user?.dataValues, password: undefined } }
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
    const newUser = await this.userRepository.create({
      username: firstLetterUppercase(dto.username),
      email: lowerCase(dto.email),
      profilePublicId,
      country: dto.country,
      emailVerificationToken,
      emailVerified: false,
      profilePicture: uploadResult?.secure_url,
      password: dto.password
    })
    await this.buyerUpdateProducer.publishBuyerUpdate({
      username: newUser.username,
      country: newUser.country,
      createdAt: newUser.createdAt,
      email: newUser.email,
      profilePicture: newUser.profilePicture,
      type: BuyerUpdate.BuyerUpdatesTypes.auth
    })
    const verificationLink = `${AuthEnvVariableKeys.clientUrl}/confirm_email?token=${emailVerificationToken}`
    await this.authEmailProducer.publishAuthEmail({
      receiverEmail: newUser.email,
      template: NotificationsEmailTemplates.verifyEmail,
      verifyLink: verificationLink
    })
    const jwtToken = await this.signInToken(newUser)
    return { user: { ...newUser?.dataValues, password: undefined }, token: jwtToken }
  }

  async signIn(dto: SignInDto) {
    const { username, password } = dto
    const isUsernameEmail = isEmail(username)
    let user: User
    if (isUsernameEmail) user = await this.userRepository.findOne({ where: { email: username } })
    else user = await this.userRepository.findOne({ where: { username } })
    if (!user) throw new BadRequestException(AuthCommonErrors.invalidCredentials)
    const isValidPassword = await compare(password, user.password)
    if (!isValidPassword) throw new BadRequestException(AuthCommonErrors.invalidCredentials)
    const jwtToken = await this.signInToken(user)
    return { user: { ...user?.dataValues, password: undefined }, token: jwtToken }
  }

  async getUserByEmailOrUsername(email: string, username: string) {
    return this.userRepository.findOne({
      raw: true,
      where: { [Op.or]: [{ username: firstLetterUppercase(username) }, { email: lowerCase(email) }] }
    })
  }

  async signInToken(user: User) {
    const jwtToken = this.configService.get(AuthEnvVariableKeys.jwtToken)
    const payload: IJwtPayload = { email: user.email, username: user.username, id: user.id }
    return sign(payload, jwtToken)
  }
}
