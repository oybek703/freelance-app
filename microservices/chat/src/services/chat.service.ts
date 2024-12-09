import { BadRequestException, Injectable } from '@nestjs/common'
import { CloudinaryService } from './cloudinary.service'
import { MessageDto } from '../dtos/message.dto'
import { v4 as uuid } from 'uuid'
import { ChatCommonErrors } from '../shared/app.constants'
import { Message, MessageDocument } from '../schemas/message.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Conversation, ConversationDocument } from '../schemas/conversation.schema'
import { ConversationDto } from '../dtos/conversation.dto'
import { ChatServiceEventNames, lowerCase, NotificationsEmailTemplates } from '@oybek703/freelance-app-shared'
import { OrderEmailProducer } from '../producers/order-email.producer'
import { SocketService } from './socket.service'
import { UpdateOffer } from '../dtos/update-offer.dto'
import { MarkAsReadMultipleDto } from '../dtos/mark-as-read-multiple.dto'

@Injectable()
export class ChatService {
  constructor(
    private readonly orderEmailProducer: OrderEmailProducer,
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
    private readonly socketService: SocketService
  ) {}

  async uploadFile(file?: string) {
    let fileUrl: string
    if (file) {
      const profilePublicId = uuid()
      const uploadResult = await this.cloudinaryService.uploadImage(file, {
        public_id: profilePublicId,
        overwrite: true,
        invalidate: true,
        resource_type: 'auto'
      })
      if (!uploadResult.public_id) throw new BadRequestException(ChatCommonErrors.fileUploadError)
      fileUrl = uploadResult?.secure_url
    }
    return fileUrl
  }

  async addMessage(dto: MessageDto) {
    const fileUrl = await this.uploadFile(dto.file)
    const messageData = {
      conversationId: dto.conversationId,
      body: dto.body,
      file: fileUrl,
      fileType: dto.fileType,
      fileSize: dto.fileSize,
      fileName: dto.fileName,
      gigId: dto.gigId,
      buyerId: dto.buyerId,
      sellerId: dto.sellerId,
      senderUsername: dto.senderUsername,
      senderPicture: dto.senderPicture,
      receiverUsername: dto.receiverUsername,
      receiverPicture: dto.receiverPicture,
      isRead: dto.isRead,
      hasOffer: dto.hasOffer,
      offer: dto.offer
    }
    const newMessage = await this.messageModel.create(messageData)

    if (!dto.hasConversationId)
      await this.createConversation({
        conversationId: dto.conversationId,
        sender: dto.senderUsername,
        receiver: dto.receiverUsername
      })

    if (dto.hasOffer) {
      await this.orderEmailProducer.publishOrderEmail({
        sender: dto.senderUsername,
        amount: dto.offer?.price,
        buyerUsername: lowerCase(`${dto.receiverUsername}`),
        sellerUsername: lowerCase(`${dto.senderUsername}`),
        title: dto.offer?.gigTitle,
        description: dto.offer?.description,
        deliveryDays: `${dto.offer?.deliveryInDays}`,
        template: NotificationsEmailTemplates.offer
      })
    }
    this.socketService.io.emit(ChatServiceEventNames.messageReceived, newMessage)
    return { message: 'Messaged added', conversationId: dto.conversationId, messageData }
  }

  async createConversation(dto: ConversationDto) {
    return this.conversationModel.create({
      conversationId: dto.conversationId,
      senderUsername: dto.sender,
      receiverUsername: dto.receiver
    })
  }

  async getConversationList(username: string) {
    const messages: MessageDocument[] = await this.messageModel.aggregate([
      {
        $match: {
          $or: [{ senderUsername: username }, { receiverUsername: username }]
        }
      },
      {
        $group: {
          _id: '$conversationId',
          result: { $top: { output: '$$ROOT', sortBy: { createdAt: -1 } } }
        }
      },
      {
        $project: {
          _id: '$result._id',
          conversationId: '$result.conversationId',
          sellerId: '$result.sellerId',
          buyerId: '$result.buyerId',
          receiverUsername: '$result.receiverUsername',
          receiverPicture: '$result.receiverPicture',
          senderUsername: '$result.senderUsername',
          senderPicture: '$result.senderPicture',
          body: '$result.body',
          file: '$result.file',
          gigId: '$result.gigId',
          isRead: '$result.isRead',
          hasOffer: '$result.hasOffer',
          createdAt: '$result.createdAt'
        }
      }
    ])
    return messages
  }

  async getConversation(sender: string, receiver: string) {
    const conversation: ConversationDocument[] = await this.conversationModel
      .aggregate([
        {
          $match: {
            $or: [
              { senderUsername: sender, receiverUsername: receiver },
              { senderUsername: receiver, receiverUsername: sender }
            ]
          }
        }
      ])
      .exec()
    return conversation
  }

  async getUserMessages(sender: string, receiver: string) {
    const messages: MessageDocument[] = await this.messageModel.aggregate([
      {
        $match: {
          $or: [
            { senderUsername: sender, receiverUsername: receiver },
            { senderUsername: receiver, receiverUsername: sender }
          ]
        }
      },
      { $sort: { createdAt: 1 } }
    ])
    return messages
  }

  async getConversationMessages(messageConversationId: string) {
    const messages: MessageDocument[] = await this.messageModel.aggregate([
      { $match: { conversationId: messageConversationId } },
      { $sort: { createdAt: 1 } }
    ])
    return messages
  }

  async updateOffer(dto: UpdateOffer) {
    const { messageId, type } = dto
    const message: MessageDocument = await this.messageModel.findOneAndUpdate(
      { _id: messageId },
      {
        $set: {
          [`offer.${type}`]: true
        }
      },
      { new: true }
    )
    return message
  }

  async markSingleMessageAsRead(messageId: string) {
    const message: MessageDocument = await this.messageModel.findOneAndUpdate(
      { _id: messageId },
      {
        $set: {
          isRead: true
        }
      },
      { new: true }
    )
    this.socketService.io.emit(ChatServiceEventNames.messageReceived, message)
    return message
  }

  async markMultipleMessagesAsRead(dto: MarkAsReadMultipleDto) {
    const { messageId, sender, receiver } = dto
    await this.messageModel.updateMany(
      { senderUsername: sender, receiverUsername: receiver, isRead: false },
      {
        $set: {
          isRead: true
        }
      }
    )
    const message: MessageDocument = await this.messageModel.findOne({ _id: messageId }).exec()
    this.socketService.io.emit(ChatServiceEventNames.messageReceived, message)
    return message
  }
}
