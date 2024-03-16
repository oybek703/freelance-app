import { ElasticsearchModuleOptions } from '@nestjs/elasticsearch'
import { ConfigService } from '@nestjs/config'
import { EnvVariableKeys } from '../app.constants'

export const getElasticSearchConfig = (configService: ConfigService): ElasticsearchModuleOptions => {
  const elasticSearchUrl = configService.get<string>(EnvVariableKeys.elasticSearchUrl)
  return { node: elasticSearchUrl, maxRetries: 10, requestTimeout: 60000, sniffOnStart: true }
}
