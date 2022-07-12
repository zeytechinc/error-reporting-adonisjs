/*
 * File: error-reporting-provider.ts
 * Created Date: Jul 12, 2022
 * Copyright (c) 2022 Zeytech Inc. (https://zeytech.com)
 * Author: Steve Krenek (https://github.com/skrenek)
 * -----
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { ErrorReportingService } from '../src/error-reporting-service'
import { Formatter } from '../src/formatter'

export default class ErrorReportingProvider {
  constructor(protected application: ApplicationContract) {}

  public static needsApplication = true

  public register() {
    console.log('registering er service')
    const logger = this.application.container.resolveBinding('Adonis/Core/Logger')
    const config = this.application.container.resolveBinding('Adonis/Core/Config')
    this.application.container.singleton('@ioc:Adonis/Addons/Zeytech/ErrorReporting', () => {
      return new ErrorReportingService(logger, config)
    })
    this.application.container.bind('@ioc:Adonis/Addons/Zeytech/ErrorReporting/Formatter', () => {
      return Formatter
    })
  }

  public boot() {
    const service: ErrorReportingService = this.application.container.resolveBinding(
      '@ioc:Adonis/Addons/Zeytech/ErrorReporting'
    )
    service.bootService()
  }
}
