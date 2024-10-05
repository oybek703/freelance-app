export enum MicroserviceNames {
  notification = 'NotificationsService',
  gateway = 'GatewayService',
  auth = 'AuthService',
  users = 'UsersService',
  gigs = 'GigsService'
}

export enum NotificationsEmailTemplates {
  verifyEmail = 'verify-email',
  forgotPassword = 'forgot-password',
  resetPasswordSuccess = 'reset-password-success'
}

export enum BaseURLRoutes {
  apiGatewayBaseURL = 'api/gateway/v1',
  authBaseURL = 'api/v1/auth',
  usersBuyerBaseURL = 'api/v1/buyer',
  usersSellerBaseURL = 'api/v1/seller',
  gigsBaseURL = 'api/v1/gigs'
}

export enum GlobalHeaderKeys {
  gatewayToken = 'gateway-token'
}

export enum TokenEnvKeys {
  jwtToken = 'JWT_TOKEN',
  gatewayJwtToken = 'GATEWAY_JWT_TOKEN'
}

export enum ElasticSearchIndexNames {
  gigs = 'gigs'
}
