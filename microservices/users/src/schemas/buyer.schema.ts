import mongoose, { HydratedDocument } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type BuyerDocument = HydratedDocument<Buyer>

@Schema({ versionKey: false, timestamps: true })
export class Buyer {
  @Prop({ type: String, required: true, index: true })
  username: string

  @Prop({ type: String, required: true, index: true })
  email: string

  @Prop({ type: String, required: true })
  profilePicture: string

  @Prop({ type: String, required: true })
  country: string

  @Prop({ type: Boolean, default: false })
  isSeller: boolean

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }], required: true, index: true })
  purchasedGigs: string[]

  @Prop({ type: Date, default: Date.now })
  createdAt: Date
}

export const buyerSchema = SchemaFactory.createForClass(Buyer)
