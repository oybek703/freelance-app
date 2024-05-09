export enum AuthEnvVariableKeys {
  enableApm = 'ENABLE_APM',
  nodeEnv = 'NODE_ENV',
  port = 'PORT',
  clientUrl = 'CLIENT_URL',
  rabbitmqEndpoint = 'RABBITMQ_ENDPOINT',
  elasticsearchUrl = 'ELASTIC_SEARCH_URL',
  elasticApmServerUrl = 'ELASTIC_APM_SERVER_URL',
  elasticApmSecretToken = 'ELASTIC_APM_SECRET_TOKEN',
  gatewayJwtToken = 'GATEWAY_JWT_TOKEN',
  jwtToken = 'JWT_TOKEN',
  apiGatewayURL = 'API_GATEWAY_URL',
  mysqlBbURL = 'MYSQL_DB_URL',
  cloudinaryAccountName = 'CLOUDINARY_ACCOUNT_NAME',
  cloudinaryApiKey = 'CLOUDINARY_API_KEY',
  cloudinaryApiSecret = 'CLOUDINARY_API_SECRET'
}

export enum AuthCommonErrors {
  userAlreadyExists = 'User already exists.',
  fileUploadError = 'File upload error. Try again later',
  invalidCredentials = 'Invalid credentials.'
}
