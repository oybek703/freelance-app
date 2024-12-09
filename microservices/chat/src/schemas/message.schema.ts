import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type MessageDocument = HydratedDocument<Message>

@Schema({ versionKey: false })
export class Message {
  @Prop({ type: String, required: true, index: true })
  conversationId: string

  @Prop({ type: String, required: true, index: true })
  senderUsername: string

  @Prop({ type: String, required: true, index: true })
  receiverUsername: string

  @Prop({ type: String, required: true })
  senderPicture: string

  @Prop({ type: String, required: true })
  receiverPicture: string

  @Prop({ type: String, default: '' })
  body: string

  @Prop({ type: String, default: '' })
  file: string

  @Prop({ type: String, default: '' })
  fileType: string

  @Prop({ type: String, default: '' })
  fileSize: string

  @Prop({ type: String, default: '' })
  fileName: string

  @Prop({ type: String, default: '' })
  gigId: string

  @Prop({ type: String, required: true })
  buyerId: string

  @Prop({ type: String, required: true })
  sellerId: string

  @Prop({ type: Boolean, default: false })
  isRead: boolean

  @Prop({ type: Boolean, default: false })
  hasOffer: boolean

  @Prop({
    type: Object,
    default: {
      gigTitle: '',
      price: 0,
      description: '',
      deliveryInDays: 0,
      oldDeliveryDate: '',
      newDeliveryDate: '',
      accepted: false,
      cancelled: false
    }
  })
  offer: {
    gigTitle: string
    price: number
    description: string
    deliveryInDays: number
    oldDeliveryDate: string
    newDeliveryDate: string
    accepted: boolean
    cancelled: boolean
  }

  @Prop({ type: Date, default: Date.now })
  createdAt: Date
}

export const MessageSchema = SchemaFactory.createForClass(Message)
