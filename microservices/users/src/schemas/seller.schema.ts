import { HydratedDocument } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type SellerDocument = HydratedDocument<Seller>

export interface ILanguage {
  language: string
  level: string
}

export interface ICertificate {
  name: string
  from: string
  year: string
}

export interface IRatingCategory {
  value: number
  count: number
}

export interface IExperience {
  company: string
  title: string
  startDate: string
  endDate: string
  description: string
  currentlyWorkingHere: boolean
}

export interface IEducation {
  country: string
  university: string
  title: string
  major: string
  year: string
}

@Schema({ versionKey: false, timestamps: true })
export class Seller {
  @Prop({ type: String, required: true })
  fullName: string

  @Prop({ type: String, required: true, index: true })
  username: string

  @Prop({ type: String, required: true, index: true })
  email: string

  @Prop({ type: String, required: true })
  profilePicture: string

  @Prop({ type: String, required: true })
  description: string

  @Prop({ type: String, required: true })
  profilePublicId: string

  @Prop({ type: String, default: '' })
  oneliner: string

  @Prop({ type: String, required: true })
  country: string

  @Prop({ type: [{ language: { type: String, required: true }, level: { type: String, required: true } }] })
  languages: ILanguage[]

  @Prop({ type: [{ type: String, required: true }] })
  skills: string[]

  @Prop({ type: Number, default: 0 })
  ratingsCount: number

  @Prop({ type: Number, default: 0 })
  ratingSum: number

  @Prop({
    type: {
      one: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
      two: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
      three: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
      four: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
      five: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } }
    }
  })
  ratingCategories: {
    five: IRatingCategory
    four: IRatingCategory
    three: IRatingCategory
    two: IRatingCategory
    one: IRatingCategory
  }

  @Prop({ type: Number, default: 0 })
  responseTime: number

  @Prop({ type: Date, default: '' })
  recentDelivery: Date

  @Prop({
    type: [
      {
        company: { type: String, default: '' },
        title: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        description: { type: String, default: '' },
        currentlyWorkingHere: { type: Boolean, default: false }
      }
    ]
  })
  experience: IExperience[]

  @Prop({
    type: [
      {
        country: { type: String, default: '' },
        university: { type: String, default: '' },
        title: { type: String, default: '' },
        major: { type: String, default: '' },
        year: { type: String, default: '' }
      }
    ]
  })
  education: IEducation[]

  @Prop({ type: [{ type: String, default: '' }] })
  socialLinks: string[]

  @Prop({ type: [{ name: { type: String }, from: { type: String }, year: { type: String } }] })
  certificates: ICertificate[]

  @Prop({ type: Number, default: 0 })
  ongoingJobs: number

  @Prop({ type: Number, default: 0 })
  completedJobs: number

  @Prop({ type: Number, default: 0 })
  cancelledJobs: number

  @Prop({ type: Number, default: 0 })
  totalEarnings: number

  @Prop({ type: Number, default: 0 })
  totalGigs: number
}

export const sellerSchema = SchemaFactory.createForClass(Seller)
