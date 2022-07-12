Example Usage
```
import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorReportingServiceContract } from '@ioc:Adonis/Addons/Zeytech/ErrorReporting'
import { inject } from '@adonisjs/fold'

@inject(['@ioc:Adonis/Addons/Zeytech/ErrorReporting'])
export default class ExceptionHandler extends HttpExceptionHandler {
  constructor (private errorReportingService: import('@ioc:Adonis/Addons/Zeytech/ErrorReporting').ErrorReportingServiceContract) {
    super(Logger)
  }

  public report(error: any, ctx: HttpContextContract): void {
      super.report(error, ctx)

      this.errorReportingService.report(error, ctx)
  }
}
```
