import { Injectable } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { CloudinaryService } from './cloudinary.service'

@Injectable()
export class ChatService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly cloudinaryService: CloudinaryService
  ) {}
}
