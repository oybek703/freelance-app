export enum MicroserviceNames {
  notification = 'NotificationsService',
  gateway = 'GatewayService',
  auth = 'AuthService'
}

export enum NotificationsEmailTemplates {
  verifyEmail = 'verify-email',
  forgotPassword = 'forgot-password'
}

export enum BaseURLRoutes {
  authBaseURL = 'api/v1/auth',
  apiGatewayBaseURL = 'api/gateway/v1'
}
