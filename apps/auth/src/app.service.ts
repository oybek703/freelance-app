import { BadRequestException, ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common'
import { User } from './database/models/user.model'
import { CloudinaryService } from './cloudinary.service'
import { AuthEmailProducer } from './producers/auth-email.producer'
import { BuyerUpdateProducer } from './producers/buyer-update.producer'
import { ConfigService } from '@nestjs/config'
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResendEmailDto,
  ResetPasswordDto,
  SignInDto,
  SignupDto
} from '@freelance-app/dtos'
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
    const clientUrl = this.configService.get<string>(AuthEnvVariableKeys.clientUrl)
    const verificationLink = `${clientUrl}/confirm_email?token=${emailVerificationToken}`
    await this.authEmailProducer.publishAuthEmail({
      receiverEmail: newUser.email,
      template: NotificationsEmailTemplates.verifyEmail,
      verifyLink: verificationLink
    })
    const jwtToken = await this.signInToken(newUser)
    return { user: { ...newUser?.dataValues, password: undefined, emailVerificationToken: undefined }, token: jwtToken }
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
    return { user: { ...user?.dataValues, password: undefined, emailVerificationToken: undefined }, token: jwtToken }
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({ where: { email } })
    if (!user) throw new BadRequestException(AuthCommonErrors.invalidCredentials)
    const clientUrl = this.configService.get<string>(AuthEnvVariableKeys.clientUrl)
    const passwordResetToken = randomBytes(20).toString('hex')
    const date: Date = new Date()
    date.setHours(date.getHours() + 1)
    await this.userRepository.update({ passwordResetToken, passwordResetExpires: date }, { where: { email } })
    const resetLink = `${clientUrl}/reset_password?token=${passwordResetToken}`
    await this.authEmailProducer.publishAuthEmail({
      receiverEmail: user.email,
      template: NotificationsEmailTemplates.forgotPassword,
      resetLink,
      username: user.username
    })
    return { message: 'Password reset email sent.' }
  }

  async resetPassword(dto: ResetPasswordDto, token: string) {
    const { password, confirmPassword } = dto
    if (password !== confirmPassword) throw new BadRequestException(AuthCommonErrors.passwordsDoNotMatch)
    const user = await this.userRepository.findOne({
      where: {
        [Op.and]: [{ passwordResetToken: token }, { passwordResetExpires: { [Op.gt]: new Date() } }]
      }
    })
    if (!user) throw new BadRequestException(AuthCommonErrors.invalidCredentials)
    await this.userRepository.update(
      { passwordResetToken: '', passwordResetExpires: new Date(), password },
      { where: { id: user.id } }
    )
    await this.authEmailProducer.publishAuthEmail({
      template: NotificationsEmailTemplates.resetPasswordSuccess,
      username: user.username
    })
    return { message: 'Password updated successfully.' }
  }

  async changePassword(dto: ChangePasswordDto, username: string) {
    const { newPassword } = dto
    const user = await this.userRepository.findOne({ where: { username } })
    if (!user) throw new BadRequestException(AuthCommonErrors.invalidCredentials)
    await this.userRepository.update({ password: newPassword }, { where: { id: user.id } })
    await this.authEmailProducer.publishAuthEmail({
      template: NotificationsEmailTemplates.resetPasswordSuccess,
      username: user.username
    })
    return { message: 'Password changed successfully.' }
  }

  async getCurrentUser(userId: string) {
    if (!userId) throw new ForbiddenException()
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) throw new BadRequestException()
    return { user: { ...user?.dataValues, password: undefined } }
  }

  async refreshToken(username: string) {
    if (!username) throw new ForbiddenException()
    const user = await this.userRepository.findOne({ where: { username } })
    if (!user) throw new BadRequestException()
    const jwtToken = await this.signInToken(user)
    return {
      user: { message: 'Refresh token', ...user?.dataValues, password: undefined, emailVerificationToken: undefined },
      token: jwtToken
    }
  }

  async resendEmail({ userId }: ResendEmailDto) {
    const existingUser = await this.userRepository.findOne({ where: { id: userId } })
    if (!existingUser) throw new BadRequestException(AuthCommonErrors.invalidCredentials)
    const emailVerificationToken = randomBytes(20).toString('hex')
    const clientUrl = this.configService.get<string>(AuthEnvVariableKeys.clientUrl)
    const verificationLink = `${clientUrl}/confirm_email?token=${emailVerificationToken}`
    await this.userRepository.update(
      { emailVerified: false, emailVerificationToken },
      { where: { id: existingUser.id } }
    )
    await this.authEmailProducer.publishAuthEmail({
      receiverEmail: existingUser.email,
      template: NotificationsEmailTemplates.verifyEmail,
      verifyLink: verificationLink
    })
    return {
      message: 'Verification email sent.',
      user: { ...existingUser?.dataValues, password: undefined, emailVerificationToken: undefined }
    }
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
