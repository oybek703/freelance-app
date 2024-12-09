import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ConversationDocument = HydratedDocument<Conversation>

@Schema()
export class Conversation {
  @Prop({ type: String, required: true, index: true, unique: true })
  conversationId: string

  @Prop({ type: String, required: true, index: true })
  senderUsername: string

  @Prop({ type: String, required: true, index: true })
  receiverUsername: string
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation)
