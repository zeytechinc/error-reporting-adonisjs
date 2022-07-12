/*
 * File: index.ts
 * Created Date: Jul 12, 2022
 * Copyright (c) 2022 Zeytech Inc. (https://zeytech.com)
 * Author: Steve Krenek (https://github.com/skrenek)
 * -----
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Adonis/Addons/Zeytech/ErrorReporting' {
  export interface DriverContract {
    name: string
    report(
      err: Error,
      ctx: import('@ioc:Adonis/Core/HttpContext').HttpContextContract
    ): Promise<void>
  }

  export interface ErrorReportingServiceContract {
    /**
     * Registers a custom driver with the plugin.  Use this in your custom driver's provider to register the callback.
     * @param driverName the name to register the driver under
     * @param callback a callback the plugin will use to construct the driver.  See ExtendDriverCallback.
     */
    extend(driverName: string, callback: ExtendDriverCallback): Promise<void>
    report(
      err: Error,
      ctx: import('@ioc:Adonis/Core/HttpContext').HttpContextContract
    ): Promise<void>
  }

  export interface DriverConfigOptions {}

  export interface DriverConfig {
    name: string
    enabled: boolean
    options: DriverConfigOptions
  }

  export interface ErrorReportingConfig {
    drivers: DriverConfig[]
  }

  export type ExtendDriverCallback = (config: DriverConfig) => Promise<DriverContract>

  const ErrorReportingService: ErrorReportingServiceContract
  export default ErrorReportingService
}
