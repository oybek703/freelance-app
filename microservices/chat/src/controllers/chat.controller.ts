import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { MessageDto } from '../dtos/message.dto'
import { ChatService } from '../services/chat.service'
import { BaseURLRoutes, GatewayGuard } from '@oybek703/freelance-app-shared'
import { UpdateOffer } from '../dtos/update-offer.dto'
import { MarkAsReadDto } from '../dtos/mark-as-read.dto'
import { MarkAsReadMultipleDto } from '../dtos/mark-as-read-multiple.dto'

@Controller(BaseURLRoutes.chatBaseURL)
@UseGuards(GatewayGuard)
export class MessageController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async addMessage(@Body() messageDto: MessageDto) {
    return this.chatService.addMessage(messageDto)
  }

  @Get('conversations/:senderUsername/:receiverUsername')
  async getUserConversation(
    @Param('senderUsername') senderUsername: string,
    @Param('receiverUsername') receiverUsername: string
  ) {
    const conversations = await this.chatService.getConversation(senderUsername, receiverUsername)
    return { message: `Conversations`, conversations }
  }

  @Get('conversations/:username')
  async getUserConversationsList(@Param('username') username: string) {
    const conversationList = await this.chatService.getConversationList(username)
    return { message: 'Conversations list', conversationList }
  }

  @Get('/:senderUsername/:receiverUsername')
  async getUserMessages(
    @Param('senderUsername') senderUsername: string,
    @Param('receiverUsername') receiverUsername: string
  ) {
    const userMessages = await this.chatService.getUserMessages(senderUsername, receiverUsername)
    return { message: 'User messages', userMessages }
  }

  @Get('/:conversationId')
  async getConversationMessages(@Param('conversationId') conversationId: string) {
    const conversationMessages = await this.chatService.getConversationMessages(conversationId)
    return { messages: 'Conversation messages', conversationMessages }
  }

  @Put('offer')
  async updateOffer(@Body() updateOffer: UpdateOffer) {
    const updatedMessage = await this.chatService.updateOffer(updateOffer)
    return { messages: 'Message updated', message: updatedMessage }
  }

  @Put('mark-as-read')
  async markSingleMessageAsRead(@Body() markAsReadDto: MarkAsReadDto) {
    const updatedMessage = await this.chatService.markSingleMessageAsRead(markAsReadDto.messageId)
    return { messages: 'Message marked as read', message: updatedMessage }
  }

  @Put('mark-as-read-multiple')
  async markMultipleMessageAsRead(@Body() markAsReadMultipleDto: MarkAsReadMultipleDto) {
    const updatedMessage = await this.chatService.markMultipleMessagesAsRead(markAsReadMultipleDto)
    return { messages: 'Messages marked as read', message: updatedMessage }
  }
}
