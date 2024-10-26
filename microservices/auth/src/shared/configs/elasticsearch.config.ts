import { ElasticsearchModuleOptions } from '@nestjs/elasticsearch'
import { ConfigService } from '@nestjs/config'
import { AuthEnvVariableKeys } from '../app.constants'

export const getElasticsearchConfig = (configService: ConfigService): ElasticsearchModuleOptions => {
  const elasticsearchUrl = configService.get<string>(AuthEnvVariableKeys.elasticsearchUrl)
  return { node: elasticsearchUrl, maxRetries: 10, sniffOnStart: false, requestTimeout: 60000 }
}
