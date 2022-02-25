import {
  DriverConfig,
  ErrorReportingConfig,
  ErrorReportingServiceContract,
} from '@ioc:Adonis/Addons/Zeytech/ErrorReporting'
import { LoggerContract } from '@ioc:Adonis/Core/Logger'
import { ConfigContract } from '@ioc:Adonis/Core/Config'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Driver } from './driver'

export class ErrorReportingService implements ErrorReportingServiceContract {
  private drivers: Driver[] = []

  constructor(private logger: LoggerContract, config: ConfigContract) {
    const errorReportingConfig = config.get('zeytech-error-reporting') as ErrorReportingConfig

    for (const driverConfig of errorReportingConfig.drivers) {
      this.loadDriver(driverConfig)
        .then(() => logger.debug(`Loaded error reporting driver: ${driverConfig.name}`))
        .catch((err: Error) =>
          logger.error(
            `Failed to load error reporting driver: ${driverConfig.name}, Reason: ${err.message}`
          )
        )
    }
  }

  private async loadDriver(driverConfig: DriverConfig) {
    // TODO: Import drivers inline as needed
    // ex:
    // const dbDriver = await import('@zeytech/db-driver')
    // Side note, config could use binding instead of name and then import with iocContainer
    switch (driverConfig.name) {
      case 'cloudWatch':
        break
      case 'db':
        break
      case 'email':
        break
      case 'logger':
        break
      case 'redis':
        break
    }
  }

  public async report(err: any, ctx: HttpContextContract) {
    try {
      for (const driver of this.drivers) {
        await driver.report(err, ctx)
      }
    } catch (ex) {
      const originalErr = (err as Error).message || (err as string)
      this.logger.error(`Failed to report error: ${originalErr}\nReason: ${ex.message}`)
    }
  }
}
