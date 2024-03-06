import { WinstonModuleOptions } from 'nest-winston'
import { ElasticsearchTransformer, ElasticsearchTransport, LogData, TransformedData } from 'winston-elasticsearch'
import { transports } from 'winston'

const esTransformer = (logData: LogData): TransformedData => ElasticsearchTransformer(logData)

export const getWinstonConfig = (level: string, service: string, elasticSearchNode: string): WinstonModuleOptions => {
  const consoleTransport = new transports.Console({ level, handleExceptions: true })
  const esTransport: ElasticsearchTransport = new ElasticsearchTransport({
    level,
    transformer: esTransformer,
    clientOpts: {
      node: elasticSearchNode,
      maxRetries: 2,
      requestTimeout: 10000,
      sniffOnStart: false
    }
  })
  return { transports: [consoleTransport, esTransport] }
}
