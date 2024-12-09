import { Controller, Get, Param, Post, Put, Req } from '@nestjs/common'
import { AxiosService } from '../../services/axios.service'
import { BaseURLRoutes } from '@oybek703/freelance-app-shared'
import { AppService } from '../../services/app.service'
import { Request } from 'express'

@Controller(BaseURLRoutes.apiGatewayBaseURL)
export class ChatServiceController {
  constructor(
    private readonly axiosService: AxiosService,
    private readonly appService: AppService
  ) {}

  @Post('/chat')
  async addMessage(@Req() req: Request) {
    const func = async () => {
      const { data } = await this.axiosService.chatInstance.post(`${BaseURLRoutes.chatBaseURL}`, req.body)
      return data
    }
    return this.appService.wrapTryCatch(func, ChatServiceController.prototype.addMessage.name)
  }

  @Get('/chat/conversations/:senderUsername/:receiverUsername')
  async getUserConversation(
    @Param('senderUsername') senderUsername: string,
    @Param('receiverUsername') receiverUsername: string
  ) {
    const func = async () => {
      const { data } = await this.axiosService.chatInstance.get(
        `${BaseURLRoutes.chatBaseURL}/conversations/${senderUsername}/${receiverUsername}`
      )
      return data
    }
    return this.appService.wrapTryCatch(func, ChatServiceController.prototype.getUserConversation.name)
  }

  @Get('/chat/conversations/:username')
  async getUserConversationsList(@Param('username') username: string) {
    const func = async () => {
      const { data } = await this.axiosService.chatInstance.get(
        `${BaseURLRoutes.chatBaseURL}/conversations/${username}`
      )
      return data
    }
    return this.appService.wrapTryCatch(func, ChatServiceController.prototype.getUserConversationsList.name)
  }

  @Get('/chat/:senderUsername/:receiverUsername')
  async getUserMessages(
    @Param('senderUsername') senderUsername: string,
    @Param('receiverUsername') receiverUsername: string
  ) {
    const func = async () => {
      const { data } = await this.axiosService.chatInstance.get(
        `${BaseURLRoutes.chatBaseURL}/${senderUsername}/${receiverUsername}`
      )
      return data
    }
    return this.appService.wrapTryCatch(func, ChatServiceController.prototype.getUserMessages.name)
  }

  @Get('/chat/:conversationId')
  async getConversationMessages(@Param('conversationId') conversationId: string) {
    const func = async () => {
      const { data } = await this.axiosService.chatInstance.get(`${BaseURLRoutes.chatBaseURL}/${conversationId}`)
      return data
    }
    return this.appService.wrapTryCatch(func, ChatServiceController.prototype.getConversationMessages.name)
  }

  @Put('/chat/offer')
  async updateOffer(@Req() req: Request) {
    const func = async () => {
      const { data } = await this.axiosService.chatInstance.put(`${BaseURLRoutes.chatBaseURL}/offer`, req.body)
      return data
    }
    return this.appService.wrapTryCatch(func, ChatServiceController.prototype.updateOffer.name)
  }

  @Put('/chat/mark-as-read')
  async markSingleMessageAsRead(@Req() req: Request) {
    const func = async () => {
      const { data } = await this.axiosService.chatInstance.put(`${BaseURLRoutes.chatBaseURL}/mark-as-read`, req.body)
      return data
    }
    return this.appService.wrapTryCatch(func, ChatServiceController.prototype.markSingleMessageAsRead.name)
  }

  @Put('/chat/mark-as-read-multiple')
  async markMultipleMessageAsRead(@Req() req: Request) {
    const func = async () => {
      const { data } = await this.axiosService.chatInstance.put(
        `${BaseURLRoutes.chatBaseURL}/mark-as-read-multiple`,
        req.body
      )
      return data
    }
    return this.appService.wrapTryCatch(func, ChatServiceController.prototype.markMultipleMessageAsRead.name)
  }
}
