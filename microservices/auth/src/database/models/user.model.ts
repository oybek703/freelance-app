import { BeforeCreate, BeforeUpdate, Column, DataType, Index, Model, Table } from 'sequelize-typescript'
import { genSalt, hash } from 'bcryptjs'

@Table({
  timestamps: true,
  comment: 'Users table',
  tableName: 'users',
  underscored: true,
  indexes: [{ fields: ['email_verification_token'], unique: true }]
})
export class User extends Model<User> {
  @Index({ unique: true })
  @Column({ type: DataType.STRING, allowNull: false })
  username: string

  @Column({ type: DataType.STRING, allowNull: false })
  password: string

  @Column({ type: DataType.STRING, allowNull: false })
  profilePublicId: string

  @Index({ unique: true })
  @Column({ type: DataType.STRING, allowNull: false })
  email: string

  @Column({ type: DataType.STRING, allowNull: false })
  country: string

  @Column({ type: DataType.STRING, allowNull: false })
  profilePicture: string

  @Column({ type: DataType.STRING, allowNull: true })
  emailVerificationToken: string

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: 0 })
  emailVerified: boolean

  @Column({ type: DataType.STRING, allowNull: true })
  passwordResetToken: string

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: Date.now })
  passwordResetExpires: Date

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    const salt = await genSalt(10)
    instance.password = await hash(instance.password, salt)
  }
}
