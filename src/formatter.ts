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
