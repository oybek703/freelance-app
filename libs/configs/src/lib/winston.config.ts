import { createLogger, Logger, transports } from 'winston'
import { ElasticsearchTransformer, ElasticsearchTransport, LogData, TransformedData } from 'winston-elasticsearch'

const esTransformer = (logData: LogData): TransformedData => ElasticsearchTransformer(logData)
export const winstonLogger = (elasticsearchNode: string, name: string, level: string): Logger => {
  const options = {
    console: {
      level,
      handleExceptions: true,
      json: false,
      colorize: true
    },
    elasticsearch: {
      level,
      transformer: esTransformer,
      clientOpts: {
        node: elasticsearchNode,
        log: level,
        maxRetries: 2,
        requestTimeout: 10000,
        sniffOnStart: false
      }
    }
  }
  const esTransport: ElasticsearchTransport = new ElasticsearchTransport(options.elasticsearch)
  return createLogger({
    exitOnError: false,
    defaultMeta: { service: name },
    transports: [new transports.Console(options.console), esTransport]
  })
}

export const getWinstonConfig = () => {}
