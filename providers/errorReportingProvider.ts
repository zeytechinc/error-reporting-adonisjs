import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { ErrorReportingService } from '../src/errorReportingService'

export default class ErrorReportingProvider {
  constructor(protected application: ApplicationContract) {}

  public static needsApplication = true

  public register() {
    const logger = this.application.container.resolveBinding('Adonis/Core/Logger')
    const config = this.application.container.resolveBinding('Adonis/Core/Config')
    this.application.container.singleton('@ioc:Adonis/Addons/Zeytech/ErrorReporting', () => {
      return new ErrorReportingService(logger, config)
    })
  }

  public boot() {}
}
