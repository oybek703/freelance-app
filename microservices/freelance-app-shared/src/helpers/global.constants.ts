export enum MicroserviceNames {
  notification = 'NotificationsService',
  gateway = 'GatewayService',
  auth = 'AuthService',
  users = 'UsersService',
  gigs = 'GigsService',
  chat = 'ChatService'
}

export enum NotificationsEmailTemplates {
  verifyEmail = 'verify-email',
  forgotPassword = 'forgot-password',
  resetPasswordSuccess = 'reset-password-success',
  offer = 'offer'
}

export enum BaseURLRoutes {
  apiGatewayBaseURL = 'api/gateway/v1',
  authBaseURL = 'api/v1/auth',
  usersBuyerBaseURL = 'api/v1/buyer',
  usersSellerBaseURL = 'api/v1/seller',
  gigsBaseURL = 'api/v1/gigs',
  chatBaseURL = 'api/v1/chat'
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

export enum GigCacheCategoryKeys {
  selectedCategories = 'selectedCategories'
}

export enum ChatServiceEventNames {
  messageReceived = 'message-received',
  messageUpdated = 'message-updated'
}
