/*
 * File: error-reporting-service.ts
 * Created Date: Jul 12, 2022
 * Copyright (c) 2022 Zeytech Inc. (https://zeytech.com)
 * Author: Steve Krenek (https://github.com/skrenek)
 * -----
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {
  DriverConfig,
  DriverContract,
  ErrorReportingConfig,
  ErrorReportingServiceContract,
  ExtendDriverCallback,
} from '@ioc:Adonis/Addons/Zeytech/ErrorReporting'
import { LoggerContract } from '@ioc:Adonis/Core/Logger'
import { ConfigContract } from '@ioc:Adonis/Core/Config'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@poppinss/utils'

export class ErrorReportingService implements ErrorReportingServiceContract {
  private drivers: DriverContract[] = []
  private extendedDriverCallbacks: Map<string, ExtendDriverCallback> = new Map()

  constructor(private logger: LoggerContract, private config: ConfigContract) {}

  /**
   * Loads the driver for the given config.
   * @param driverConfig
   */
  private async loadDriver(driverConfig: DriverConfig) {
    switch (driverConfig.name) {
      case 'logger':
        this.drivers.push(await this.makeLoggerDriver(driverConfig))
        break
      default:
        this.drivers.push(await this.makeExtendedDriver(driverConfig))
    }
  }

  public async report(err: any, ctx: HttpContextContract) {
    for (const driver of this.drivers) {
      try {
        await driver.report(err, ctx)
      } catch (ex) {
        const originalErr = (err as Error).message || (err as string)
        this.logger.error(
          `Failed to report error in driver ${driver.name}: ${originalErr}\nReason: ${ex.message}`
        )
      }
    }
  }

  public bootService() {
    const errorReportingConfig = this.config.get('error-reporting') as ErrorReportingConfig

    for (const driverConfig of errorReportingConfig.drivers) {
      if (driverConfig.enabled) {
        this.loadDriver(driverConfig)
          .then(() => this.logger.debug(`Loaded error reporting driver: ${driverConfig.name}`))
          .catch((err: Error) =>
            this.logger.error(
              `Failed to load error reporting driver ${driverConfig.name}, Reason: ${err.message}`
            )
          )
      } else {
        this.logger.debug(
          `Skipping error reporting ${driverConfig.name} driver load.  It is disabled.`
        )
      }
    }
  }

  /**
   * Registers a custom driver with the plugin.  Use this in your custom driver's provider to register the callback.
   * @param driverName the name to register the driver under
   * @param callback a callback the plugin will use to construct the driver.  See ExtendDriverCallback.
   */
  public async extend(driverName: string, callback: ExtendDriverCallback): Promise<void> {
    if (typeof callback !== 'function') {
      throw new Exception('ErrorReportingService.extend expects callback to be a function')
    }
    this.extendedDriverCallbacks.set(driverName, callback)
  }

  private async makeLoggerDriver(config: DriverConfig): Promise<DriverContract> {
    const { LoggerDriver } = await import('./Drivers/Logger')
    return new LoggerDriver(config, this.logger)
  }

  /**
   * Executes the registered callback to create a custom driver for the plugin
   * @param config the config to pass to the callback for construction
   * @returns a Promise of a DriverContract instance
   * @throws Exception if config.name is not a registered driver
   */
  private async makeExtendedDriver(config: DriverConfig): Promise<DriverContract> {
    const callback = this.extendedDriverCallbacks.get(config.name)
    if (typeof callback === 'function') {
      return await callback(config)
    }

    throw new Exception(`Unknown error reporting driver "${config.name}"`)
  }
}
