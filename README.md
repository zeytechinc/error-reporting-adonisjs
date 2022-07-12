# @zeytech/error-reporting-adonisjs
> An Error reporting module for AdonisJS

[![npm-image]][npm-url] [![license-image]][license-url] [![typescript-image]][typescript-url]

This module provides a pluggable error reporting service for use with Adonis's built-in error reporting feature.  One or more drivers can be configured to report errors to various destinations.  By default this plugin comes with a Logger driver.  Additional drivers can be installed on top to make use of other destinations such as files or network services.

## Installation

`npm install @zeytech/error-reporting-adonis`

`node ace configure @zeytech/error-reporting-adonis`

## Usage

### Handler Setup
The plugin comes with an error reporting utility service that can be used in your exception handler's report method, as shown in the example below.  Please note the following:

* The error reporting service is injected into the constructor of the handler.  Its type is imported dynamically to avoid resolution errors during startup.
* The Handler's report function calls the error reporting service's report function.

```typescript
import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { inject } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

@inject(['@ioc:Adonis/Addons/Zeytech/ErrorReporting'])
export default class ExceptionHandler extends HttpExceptionHandler {
  constructor (
    private errorReportingService: import('@ioc:Adonis/Addons/Zeytech/ErrorReporting').ErrorReportingServiceContract) {
    super(Logger)
  }

  public report (error: any, ctx: HttpContextContract): void {
    this.errorReportingService.report(error, ctx)
  }
}
```

### Config

With the handler complete, you'll need to configure one or more drivers to actually report to.  This is done via the `error-reporting.ts` config file (installed when configuring the plugin).  If multiple drivers are configured, errors will be reported to _each_ driver.  In extreme cases this could cause performance problems, so use common sense when deciding where to report to.

The config file contains an array of driver configurations.  Each configuration contains the name of the driver and any options the driver expects.  See the example file below.

```typescript
import { ErrorReportingConfig } from '@ioc:Adonis/Addons/Zeytech/ErrorReporting'

const errorReportingConfig: ErrorReportingConfig = {
  /**
   * Drivers to use in error reporting
   */
  drivers: [
    {
      name: 'logger',
      enabled: true,
      options: {},
    },
    {
      name: 'file',
      enabled: true,
      options: {
        path: './logs/errors.out',
        includeTimestamp: true,
      },
    },
  ],
}

export default errorReportingConfig
```

The example above includes a coniguration for the built in logger driver as well as a fictitious file driver.

### Drivers
#### Logger Driver
The logger driver is very minimal and simply performs a `logger.error(err)` call to log the error to the built-in logging system.  It is mainly provided for example purposes.

#### Custom Drivers
You can create your own custom driver by implementing the `DriverContract` contract (interface).  A simple example is shown below.  _Note_ that these drivers are constructed during AdonisJS's boot sequence, so beware of what dependencies you import directly vs injecting via the constructor.

```typescript
import { DriverContract } from '@ioc:Adonis/Addons/Zeytech/ErrorReporting'

export class MyDriver implements DriverContract {

  // You can pass in the config if needed so that you'll have access to any options your driver requires.
  constructor(private config: DriverConfig) {}

  public name = 'my-driver' // the name the driver is registered under in your app(s)

  public async report(error: Error, _ctx: HttpContextContract): Promise<void> {
    // handle the error message as needed to report it
  }
}
```

Once created, you'll need to register your new driver during AdonisJS's boot sequence.  To do so, make use of the extend function included in the error reporting service.

```typescript
import {
  ErrorReportingServiceContract,
  ExtendDriverCallback,
} from '@ioc:Adonis/Addons/Zeytech/ErrorReporting'

export default class AppProvider {
  constructor(protected application: ApplicationContract) {}
  //...

  public async register() {
    const ErrorReportingService: ErrorReportingServiceContract =
      this.application.container.resolveBinding('@ioc:Adonis/Addons/Zeytech/ErrorReporting')
    const { MyDriver } = await import('../path/to/MyDriver')
    const callback: ExtendDriverCallback = async (config: DriverConfig) => {
      return new MyDriver(config)
    }
    ErrorReportingService.extend('my-driver', callback)
  }

  //...
}
```

With the driver registered, then add your configuration as shown in [Config](#config) above.

[npm-image]: https://img.shields.io/npm/v/@zeytech/error-reporting-adonisjs.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/@zeytech/error-reporting-adonisjs "npm"

[license-image]: https://img.shields.io/npm/l/@zeytech/error-reporting-adonisjs?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]:  "typescript"
