export enum MicroserviceNames {
  notification = 'NotificationsService',
  gateway = 'GatewayService',
  auth = 'AuthService',
  users = 'UsersService'
}

export enum NotificationsEmailTemplates {
  verifyEmail = 'verify-email',
  forgotPassword = 'forgot-password',
  resetPasswordSuccess = 'reset-password-success'
}

export enum BaseURLRoutes {
  authBaseURL = 'api/v1/auth',
  apiGatewayBaseURL = 'api/gateway/v1'
}

export enum GlobalHeaderKeys {
  gatewayToken = 'gateway-token'
}
