import { ElasticsearchTransformer, ElasticsearchTransport, LogData, TransformedData } from 'winston-elasticsearch'
import { createLogger, Logger, transports } from 'winston'
import { LogLevel } from '@nestjs/common'
import { MicroserviceNames } from '@freelance-app/helpers'

const esTransformer = (logData: LogData): TransformedData => ElasticsearchTransformer(logData)

export const getLoggerConfig =
  (elasticsearchNode: string, serviceName: MicroserviceNames, level: LogLevel) => (): Logger => {
    const consoleTransport = new transports.Console({ level, handleExceptions: true })
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
