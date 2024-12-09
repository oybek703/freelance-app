import { Injectable } from '@nestjs/common'
import { UploadApiOptions, v2 } from 'cloudinary'
import { ConfigService } from '@nestjs/config'
import { ChatEnvVariableKeys } from '../shared/app.constants'

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    const cloudinaryCloudName = this.configService.get(ChatEnvVariableKeys.cloudinaryAccountName)
    const cloudinaryApiKey = this.configService.get(ChatEnvVariableKeys.cloudinaryApiKey)
    const cloudinaryApiSecret = this.configService.get(ChatEnvVariableKeys.cloudinaryApiSecret)
    v2.config({
      cloud_name: cloudinaryCloudName,
      api_key: cloudinaryApiKey,
      api_secret: cloudinaryApiSecret
    })
  }

  async uploadImage(file: string, options: UploadApiOptions) {
    return v2.uploader.upload(file, options)
  }
}
