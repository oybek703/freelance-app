import { ElasticsearchModuleOptions } from '@nestjs/elasticsearch'
import { ConfigService } from '@nestjs/config'
import { UsersEnvVariableKeys } from '../app.constants'

export const getElasticsearchConfig = (configService: ConfigService): ElasticsearchModuleOptions => {
  const elasticsearchUrl = configService.get<string>(UsersEnvVariableKeys.elasticsearchUrl)
  return { node: elasticsearchUrl, maxRetries: 10, sniffOnStart: false, requestTimeout: 60000 }
}
