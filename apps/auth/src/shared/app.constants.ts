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
  mysqlDbHost = 'MYSQL_DB_HOST',
  mysqlDbPort = 'MYSQL_DB_PORT',
  mysqlDbUsername = 'MYSQL_DB_USERNAME',
  mysqlDbPassword = 'MYSQL_DB_PASSWORD',
  mysqlDbName = 'MYSQL_DB_NAME',
  cloudinaryAccountName = 'CLOUDINARY_ACCOUNT_NAME',
  cloudinaryApiKey = 'CLOUDINARY_API_KEY',
  cloudinaryApiSecret = 'CLOUDINARY_API_SECRET'
}

export enum AuthCommonErrors {
  userAlreadyExists = 'User already exists.',
  fileUploadError = 'File upload error. Try again later',
  invalidCredentials = 'Invalid credentials.',
  passwordsDoNotMatch = 'Passwords do not match.'
}

export enum ProviderKeys {
  USER_REPOSITORY = 'USER_REPOSITORY',
  SEQUELIZE = 'SEQUELIZE'
}
