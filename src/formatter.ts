/*
 * File: formatter.ts
 * Created Date: Jul 12, 2022
 * Copyright (c) 2022 Zeytech Inc. (https://zeytech.com)
 * Author: Steve Krenek (https://github.com/skrenek)
 * -----
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@poppinss/utils'

export class Formatter {
  public static formatError(err: Error): string {
    if (err instanceof Exception) {
      const ex = err as Exception
      return `${ex.stack || Formatter.formatBaseString(ex)}\n${ex.help}`
    }
    return `${err.stack || Formatter.formatBaseString(err)}`
  }

  private static formatBaseString(err: Error): string {
    return `${err.name} ${err.message}`
  }
}
