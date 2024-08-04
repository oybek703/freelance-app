import { ElasticsearchTransformer, ElasticsearchTransport, LogData, TransformedData } from 'winston-elasticsearch'
import { createLogger, format, Logger, transports } from 'winston'
import { LogLevel } from '@nestjs/common'
import { MicroserviceNames } from './global.constants'

const esTransformer = (logData: LogData): TransformedData => ElasticsearchTransformer(logData)

export const winstonLogger =
  (elasticsearchNode: string, serviceName: MicroserviceNames, level: LogLevel) => (): Logger => {
    const consoleTransport = new transports.Console({
      level,
      handleExceptions: true,
      format: format.combine(format.colorize(), format.simple(), format.timestamp())
    })
    const esTransport: ElasticsearchTransport = new ElasticsearchTransport({
      level,
      transformer: esTransformer,
      clientOpts: {
        node: elasticsearchNode,
        maxRetries: 2,
        requestTimeout: 10000,
        sniffOnStart: false
      }
    })
    return createLogger({
      exitOnError: false,
      defaultMeta: { service: serviceName },
      transports: [consoleTransport, esTransport]
    })
  }
