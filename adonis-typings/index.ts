declare module '@ioc:Adonis/Addons/Zeytech/ErrorReporting' {
  export interface ErrorReportingServiceContract {
    report(err: any, ctx: import('@ioc:Adonis/Core/HttpContext').HttpContextContract): Promise<void>
  }

  export type DriverType = 'logger' | 'db' | 'redis' | 'cloudWatch' | 'email'

  export interface DriverConfig {
    name: DriverType
    options: {}
  }

  export interface ErrorReportingConfig {
    drivers: DriverConfig[]
  }

  const ErrorReportingService: import('@ioc:Adonis/Addons/Zeytech/ErrorReporting').ErrorReportingServiceContract
  export default ErrorReportingService
}
