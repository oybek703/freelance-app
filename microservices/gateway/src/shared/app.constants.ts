export enum GatewayEnvVariableKeys {
  port = 'PORT',
  enableApm = 'ENABLE_APM',
  gatewayJwtToken = 'GATEWAY_JWT_TOKEN',
  jwtToken = 'JWT_TOKEN',
  nodeEnv = 'NODE_ENV',
  secretKeyOne = 'SECRET_KEY_ONE',
  secretKeyTwo = 'SECRET_KEY_TWO',
  clientURL = 'CLIENT_URL',
  authBaseURL = 'AUTH_BASE_URL',
  usersBaseURL = 'USERS_BASE_URL',
  gigBaseURL = 'GIG_BASE_URL',
  messageBaseURL = 'MESSAGE_BASE_URL',
  orderBaseURL = 'ORDER_BASE_URL',
  reviewBaseURL = 'REVIEW_BASE_URL',
  redisHost = 'REDIS_HOST',
  elasticsearchURL = 'ELASTIC_SEARCH_URL',
  elasticApmServerURL = 'ELASTIC_APM_SERVER_URL',
  elasticApmSecretToken = 'ELASTIC_APM_SECRET_TOKEN'
}

export enum SocketServiceEvents {
  online = 'online'
}

export const loggedInUsersCacheKey = 'loggedInUsers'
