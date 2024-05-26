import { Injectable } from '@nestjs/common'
import { UploadApiOptions, v2 } from 'cloudinary'
import { ConfigService } from '@nestjs/config'
import { AuthEnvVariableKeys } from '../shared/app.constants'

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    const cloudinaryCloudName = this.configService.get(AuthEnvVariableKeys.cloudinaryAccountName)
    const cloudinaryApiKey = this.configService.get(AuthEnvVariableKeys.cloudinaryApiKey)
    const cloudinaryApiSecret = this.configService.get(AuthEnvVariableKeys.cloudinaryApiSecret)
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
