import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export interface Driver {
  report(error: any, ctx: HttpContextContract): Promise<void>
}
