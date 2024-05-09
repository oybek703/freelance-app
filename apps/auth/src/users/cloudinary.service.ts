import { Injectable } from '@nestjs/common'
import { UploadApiOptions, v2 } from 'cloudinary'

@Injectable()
export class CloudinaryService {
  async uploadImage(file: string, options: UploadApiOptions) {
    return v2.uploader.upload(file, options)
  }
}
