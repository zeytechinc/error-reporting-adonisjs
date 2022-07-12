/*
 * File: index.ts
 * Created Date: Jul 12, 2022
 * Copyright (c) 2022 Zeytech Inc. (https://zeytech.com)
 * Author: Steve Krenek (https://github.com/skrenek)
 * -----
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DriverConfig, DriverContract } from '@ioc:Adonis/Addons/Zeytech/ErrorReporting'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { LoggerContract } from '@ioc:Adonis/Core/Logger'
import { Formatter } from '../../formatter'

export class LoggerDriver implements DriverContract {
  private logger: LoggerContract

  constructor(_config: DriverConfig, logger: LoggerContract) {
    this.logger = logger
  }

  public get name(): string {
    return 'logger'
  }

  public async report(err: Error, _ctx: HttpContextContract): Promise<void> {
    this.logger.error(Formatter.formatError(err))
  }
}
